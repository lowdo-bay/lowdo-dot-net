import { verifyToken } from './admin-auth.mjs';
import matter from 'gray-matter';

const REPO_OWNER = 'lowdo-bay';
const REPO_NAME = 'lowdo-dot-net';
const BRANCH = 'main';

async function githubApi(path, options = {}) {
  const token = process.env.GITHUB_TOKEN;
  const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...options.headers
    }
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${res.status}: ${body}`);
  }
  return res.json();
}

async function getHeadSha() {
  const ref = await githubApi(`/git/ref/heads/${BRANCH}`);
  return ref.object.sha;
}

async function getCommitTreeSha(commitSha) {
  const commit = await githubApi(`/git/commits/${commitSha}`);
  return commit.tree.sha;
}

async function getFileContent(filePath) {
  const data = await githubApi(`/contents/${filePath}?ref=${BRANCH}`);
  const content = Buffer.from(data.content, 'base64').toString('utf-8');
  return { content, sha: data.sha };
}

async function getDirContents(dirPath) {
  const data = await githubApi(`/contents/${dirPath}?ref=${BRANCH}`);
  return Array.isArray(data) ? data : [];
}

async function createBlob(content) {
  const blob = await githubApi('/git/blobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, encoding: 'utf-8' })
  });
  return blob.sha;
}

async function createTree(baseTreeSha, treeItems) {
  const tree = await githubApi('/git/trees', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base_tree: baseTreeSha, tree: treeItems })
  });
  return tree.sha;
}

async function createCommit(treeSha, parentSha, message) {
  const commit = await githubApi('/git/commits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, tree: treeSha, parents: [parentSha] })
  });
  return commit.sha;
}

async function updateRef(commitSha) {
  await githubApi(`/git/refs/heads/${BRANCH}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sha: commitSha })
  });
}

// Serialize all editable frontmatter fields back to the markdown file
function applyChangesToFile(fileContent, change) {
  const parsed = matter(fileContent);
  const d = parsed.data;

  if (change.type !== undefined)              d.type = change.type || null;
  if (change.categories !== undefined)        d.categories = change.categories;
  if (change.draft !== undefined)             d.draft = change.draft;
  if (change.title !== undefined)             d.title = change.title;
  if (change.subtitle !== undefined)          d.subtitle = change.subtitle || null;
  if (change.description !== undefined)       d.description = change.description || null;
  if (change.date !== undefined)              d.date = change.date ? new Date(change.date) : null;
  if (change.year !== undefined)              d.year = change.year || null;
  if (change.location !== undefined)          d.location = change.location || null;
  if (change.status !== undefined)            d.status = change.status || null;
  if (change.link !== undefined)              d.link = change.link || null;
  if (change.position !== undefined)          d.position = change.position !== '' ? Number(change.position) : null;
  if (change.featured !== undefined)          d.featured = change.featured;
  if (change.featuredPosition !== undefined)  d.featuredPosition = change.featuredPosition ? Number(change.featuredPosition) : null;
  if (change.collaborators !== undefined)     d.collaborators = change.collaborators;
  if (change.relatedProjects !== undefined)   d.relatedProjects = change.relatedProjects;

  // Body text replaces markdown content (below frontmatter)
  const bodyContent = change.body !== undefined ? (change.body || '') : parsed.content;

  // Remove null/undefined fields to keep files clean
  Object.keys(d).forEach(key => { if (d[key] === null || d[key] === undefined) delete d[key]; });

  return matter.stringify(bodyContent, d);
}

// Build a minimal frontmatter template for a new entry
function buildNewEntryContent(change) {
  const d = {
    draft: change.draft !== false,
    type: change.entryType || 'other',
    title: change.title || 'New Entry',
    date: change.date ? new Date(change.date) : new Date()
  };
  if (change.subtitle)     d.subtitle = change.subtitle;
  if (change.description)  d.description = change.description;
  if (change.categories && change.categories.length) d.categories = change.categories;
  else d.categories = [];
  if (change.link)  d.link = change.link;
  if (change.year)  d.year = change.year;
  if (change.location)      d.location = change.location;
  if (change.status)        d.status = change.status;
  if (change.featured)      d.featured = change.featured;
  if (change.featuredPosition) d.featuredPosition = Number(change.featuredPosition);
  if (change.collaborators && change.collaborators.length) d.collaborators = change.collaborators;
  if (change.relatedProjects && change.relatedProjects.length) d.relatedProjects = change.relatedProjects;

  return matter.stringify(change.body || '', d);
}

// Map type name to folder name — only two folders now
function typeToFolder(entryType) {
  return entryType === 'project' ? 'projects' : 'other';
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const secret = process.env.ADMIN_TOKEN_SECRET;
  if (!secret) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server not configured' }) };
  }

  const { token, changes } = JSON.parse(event.body || '{}');

  if (!token || !verifyToken(token, secret)) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Invalid or expired token' }) };
  }

  if (!changes || !Array.isArray(changes) || changes.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No changes provided' }) };
  }

  try {
    const headSha = await getHeadSha();
    const baseTreeSha = await getCommitTreeSha(headSha);

    const treeItems = [];
    const summaryParts = [];

    for (const change of changes) {
      const { filePath, action } = change;

      // ---- Delete entry ----
      if (action === 'delete') {
        const pathParts = filePath.split('/');
        const entriesIdx = pathParts.indexOf('entries');
        const entryFolder = `entries/${pathParts[entriesIdx + 1]}/${pathParts[entriesIdx + 2]}`;

        const dirFiles = await getDirContents(entryFolder);
        for (const file of dirFiles) {
          if (file.type === 'file') {
            treeItems.push({ path: file.path, mode: '100644', type: 'blob', sha: null });
          }
        }
        summaryParts.push(`Delete ${pathParts[entriesIdx + 2]}`);
        continue;
      }

      // ---- Create new entry ----
      if (action === 'create') {
        const folder = typeToFolder(change.entryType);
        const slug = change.slug;
        const newFilePath = `entries/${folder}/${slug}/${slug}.md`;
        const content = buildNewEntryContent(change);
        const blobSha = await createBlob(content);
        treeItems.push({ path: newFilePath, mode: '100644', type: 'blob', sha: blobSha });
        summaryParts.push(`Create ${slug}`);
        continue;
      }

      // ---- Move entry (project ↔ other boundary crossing) ----
      // Only move files when the entry crosses between projects/ and other/.
      // Type changes within the same folder (e.g. award → feature) are frontmatter-only.
      if (change.newEntryType) {
        const pathParts = filePath.split('/');
        const entriesIdx = pathParts.indexOf('entries');
        const oldTypeFolder = pathParts[entriesIdx + 1];
        const entryFolder = pathParts[entriesIdx + 2];
        const newTypeFolder = typeToFolder(change.newEntryType);

        if (oldTypeFolder !== newTypeFolder) {
          // File move required
          const oldDirPath = `entries/${oldTypeFolder}/${entryFolder}`;
          const newDirPath = `entries/${newTypeFolder}/${entryFolder}`;

          const dirFiles = await getDirContents(oldDirPath);
          for (const file of dirFiles) {
            if (file.type !== 'file') continue;
            const newFilePath = `${newDirPath}/${file.name}`;
            const oldFilePath = file.path;

            if (file.name.endsWith('.md')) {
              const { content } = await getFileContent(oldFilePath);
              const updatedContent = applyChangesToFile(content, change);
              const blobSha = await createBlob(updatedContent);
              treeItems.push({ path: newFilePath, mode: '100644', type: 'blob', sha: blobSha });
            } else {
              treeItems.push({ path: newFilePath, mode: '100644', type: 'blob', sha: file.sha });
            }
            treeItems.push({ path: oldFilePath, mode: '100644', type: 'blob', sha: null });
          }
          summaryParts.push(`Move ${entryFolder} → ${newTypeFolder}`);
        } else {
          // Same folder — just update frontmatter
          const { content } = await getFileContent(filePath);
          const updatedContent = applyChangesToFile(content, change);
          const blobSha = await createBlob(updatedContent);
          treeItems.push({ path: filePath, mode: '100644', type: 'blob', sha: blobSha });
          summaryParts.push(`Update ${entryFolder}`);
        }
        continue;
      }

      // ---- Update existing entry ----
      const { content } = await getFileContent(filePath);
      const updatedContent = applyChangesToFile(content, change);
      const blobSha = await createBlob(updatedContent);
      treeItems.push({ path: filePath, mode: '100644', type: 'blob', sha: blobSha });

      const entryName = filePath.split('/').slice(-2, -1)[0];
      summaryParts.push(`Update ${entryName}`);
    }

    if (treeItems.length === 0) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'No changes to commit' })
      };
    }

    const newTreeSha = await createTree(baseTreeSha, treeItems);
    const commitMessage = summaryParts.length <= 3
      ? summaryParts.join('; ')
      : `Update ${changes.length} entries via admin`;
    const newCommitSha = await createCommit(newTreeSha, headSha, commitMessage);
    await updateRef(newCommitSha);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Committed ${changes.length} change(s)`,
        commit: newCommitSha,
        details: summaryParts
      })
    };
  } catch (err) {
    console.error('Update failed:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message })
    };
  }
}
