import { verifyToken } from './admin-auth.mjs';

const REPO_OWNER = 'lowdo-bay';
const REPO_NAME = 'lowdo-dot-net';
const BRANCH = 'main';

async function githubApi(path) {
  const token = process.env.GITHUB_TOKEN;
  const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}${path}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${res.status}: ${body}`);
  }
  return res.json();
}

// Recursively fetch the docs/ tree in one call using the git trees API
async function getDocsTree() {
  const ref = await githubApi(`/git/ref/heads/${BRANCH}`);
  const commitSha = ref.object.sha;
  const commit = await githubApi(`/git/commits/${commitSha}`);
  const tree = await githubApi(`/git/trees/${commit.tree.sha}?recursive=1`);

  const items = (tree.tree || []).filter(item =>
    item.path.startsWith('docs/') && item.type === 'blob' && item.path.endsWith('.md')
  );

  return items.map(item => ({ path: item.path, sha: item.sha }));
}

async function getFileContent(filePath) {
  const data = await githubApi(`/contents/${filePath}?ref=${BRANCH}`);
  return Buffer.from(data.content, 'base64').toString('utf-8');
}

export async function handler(event) {
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const secret = process.env.ADMIN_TOKEN_SECRET;
  if (!secret) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server not configured' }) };
  }

  const params = event.queryStringParameters || {};
  const token = params.token || '';

  if (!token || !verifyToken(token, secret)) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Invalid or expired token' }) };
  }

  try {
    // ?action=tree  — return file list
    if (params.action === 'tree' || !params.action) {
      const files = await getDocsTree();
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files })
      };
    }

    // ?action=file&path=docs/...  — return file content
    if (params.action === 'file') {
      const filePath = params.path || '';
      if (!filePath.startsWith('docs/') || !filePath.endsWith('.md')) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid path' }) };
      }
      const content = await getFileContent(filePath);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      };
    }

    return { statusCode: 400, body: JSON.stringify({ error: 'Unknown action' }) };
  } catch (err) {
    console.error('read-docs error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message })
    };
  }
}
