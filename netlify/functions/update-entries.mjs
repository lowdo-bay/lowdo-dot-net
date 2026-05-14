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

async function createBlob(content, encoding) {
  const blob = await githubApi('/git/blobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, encoding: encoding || 'utf-8' })
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
  if (change.showInAwardsTable !== undefined) d.showInAwardsTable = change.showInAwardsTable;
  if (change.collaborators !== undefined)     d.collaborators = change.collaborators;
  if (change.relatedProjects !== undefined)   d.relatedProjects = change.relatedProjects;
  if (change.relatedEntries !== undefined)    d.relatedEntries = change.relatedEntries;
  if (change.active !== undefined)            d.active = change.active;

  // ADU library — top-level flag and nested spec block.
  // When the flag is unchecked, remove BOTH the flag and the nested block from frontmatter
  // so the file stays clean.
  if (change.adu_library !== undefined) {
    if (change.adu_library === true) {
      d.adu_library = true;
    } else {
      delete d.adu_library;
      delete d.adu;
    }
  }
  if (change.adu !== undefined) {
    if (change.adu && typeof change.adu === 'object' && Object.keys(change.adu).length > 0) {
      d.adu = change.adu;
    } else {
      delete d.adu;
    }
  }

  // Body text replaces markdown content (below frontmatter).
  // Only replace when the caller explicitly provides a non-empty body; otherwise preserve existing content.
  const bodyContent = (change.body !== undefined && change.body !== null && change.body !== '')
    ? change.body
    : parsed.content;

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
  if (change.showInAwardsTable) d.showInAwardsTable = change.showInAwardsTable;
  if (change.collaborators && change.collaborators.length) d.collaborators = change.collaborators;
  if (change.relatedProjects && change.relatedProjects.length) d.relatedProjects = change.relatedProjects;
  if (change.relatedEntries && change.relatedEntries.length) d.relatedEntries = change.relatedEntries;
  if (change.adu_library === true) d.adu_library = true;
  if (change.adu && typeof change.adu === 'object' && Object.keys(change.adu).length > 0) d.adu = change.adu;

  return matter.stringify(change.body || '', d);
}

// Map type name to folder name — only two folders now
function typeToFolder(entryType) {
  return entryType === 'project' ? 'projects' : 'other';
}

export async function handler(event) {
  const secret = process.env.ADMIN_TOKEN_SECRET;
  if (!secret) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server not configured' }) };
  }

  // Handle GET — list entry folder files for the admin file manager
  if (event.httpMethod === 'GET') {
    const params = event.queryStringParameters || {};
    if (!params.token || !verifyToken(params.token, secret)) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }
    if (params.action === 'listFiles' && params.dirPath) {
      try {
        const files = await getDirContents(params.dirPath);
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            files: files.map(f => ({ name: f.name, path: f.path, sha: f.sha, size: f.size }))
          })
        };
      } catch (err) {
        return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ files: [] }) };
      }
    }
    return { statusCode: 400, body: JSON.stringify({ error: 'Unknown action' }) };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const parsedBody = JSON.parse(event.body || '{}');

  // Phase 1: upload a single blob and return its SHA — no commit, no deploy.
  if (parsedBody.action === 'uploadBlob') {
    if (!parsedBody.token || !verifyToken(parsedBody.token, secret)) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Invalid or expired token' }) };
    }
    if (!parsedBody.base64) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing base64' }) };
    }
    try {
      const sha = await createBlob(parsedBody.base64, 'base64');
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sha })
      };
    } catch (err) {
      return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
  }

  const { token, changes } = parsedBody;

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

      // ---- File operations (upload / rename / delete individual files) ----
      // Processed first so they always run regardless of which action follows.
      if (change.fileOps && change.fileOps.length) {
        for (const op of change.fileOps) {
          if (op.action === 'upload') {
            // Prefer a precomputed SHA from Phase 1; fall back to base64 for older clients.
            let blobSha = op.sha;
            if (!blobSha && op.base64) {
              blobSha = await createBlob(op.base64, 'base64');
            }
            treeItems.push({ path: op.path, mode: '100644', type: 'blob', sha: blobSha });
          } else if (op.action === 'delete') {
            treeItems.push({ path: op.path, mode: '100644', type: 'blob', sha: null });
          } else if (op.action === 'rename') {
            treeItems.push({ path: op.newPath, mode: '100644', type: 'blob', sha: op.sha });
            treeItems.push({ path: op.oldPath, mode: '100644', type: 'blob', sha: null });
          }
        }
      }

      // ---- File-ops-only (no frontmatter change needed) ----
      if (action === 'fileOpsOnly') {
        const entryName = filePath.split('/').slice(-2, -1)[0];
        summaryParts.push(`Update files: ${entryName}`);
        continue;
      }

      // ---- Update canonical categories list ----
      if (action === 'updateCategories') {
        const header = '# Canonical list of categories for entry tagging\n# Used by the admin page for autocomplete and the main site for filter display\n# Categories are uppercase by convention\n\n';
        const yaml = (change.categories || []).map(c => `- ${c}`).join('\n') + '\n';
        const blobSha = await createBlob(header + yaml);
        treeItems.push({ path: filePath, mode: '100644', type: 'blob', sha: blobSha });
        summaryParts.push('Update canonicalCategories');
        continue;
      }

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

      // ---- Rename entry (slug change — moves folder and file names) ----
      if (action === 'rename') {
        const oldFilePath = change.oldFilePath; // e.g. entries/projects/old-slug/old-slug.md
        const pathParts = oldFilePath.split('/');
        const entriesIdx = pathParts.indexOf('entries');
        const oldTypeFolder = pathParts[entriesIdx + 1]; // projects or other
        // Use new type folder if the type also changed
        const newTypeFolder = change.newEntryType ? typeToFolder(change.newEntryType) : oldTypeFolder;
        const oldSlug = pathParts[entriesIdx + 2];
        const newSlug = change.newSlug;
        const oldDirPath = `entries/${oldTypeFolder}/${oldSlug}`;
        const newDirPath = `entries/${newTypeFolder}/${newSlug}`;

        const dirFiles = await getDirContents(oldDirPath);
        for (const file of dirFiles) {
          if (file.type !== 'file') continue;
          // Rename the .md file; other files (images) keep their name under the new folder
          const newFileName = file.name === `${oldSlug}.md` ? `${newSlug}.md` : file.name;
          const newFilePath = `${newDirPath}/${newFileName}`;
          const oldFilePath2 = file.path;

          if (file.name.endsWith('.md')) {
            const { content } = await getFileContent(oldFilePath2);
            const updatedContent = applyChangesToFile(content, change);
            const blobSha = await createBlob(updatedContent);
            treeItems.push({ path: newFilePath, mode: '100644', type: 'blob', sha: blobSha });
          } else {
            treeItems.push({ path: newFilePath, mode: '100644', type: 'blob', sha: file.sha });
          }
          // Delete old path
          treeItems.push({ path: oldFilePath2, mode: '100644', type: 'blob', sha: null });
        }
        summaryParts.push(`Rename ${oldSlug} → ${newSlug}`);
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
