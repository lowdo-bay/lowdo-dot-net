import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const TOKEN_EXPIRY_HOURS = 24;

function signToken(secret) {
  const payload = {
    exp: Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000
  };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(data).digest('base64url');
  return `${data}.${sig}`;
}

export function verifyToken(token, secret) {
  const [data, sig] = token.split('.');
  if (!data || !sig) return false;
  const expected = crypto.createHmac('sha256', secret).update(data).digest('base64url');
  if (sig !== expected) return false;
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString());
    if (payload.exp < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const { password } = JSON.parse(event.body || '{}');
  if (!password) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Password required' }) };
  }

  const hash = process.env.ADMIN_PASSWORD_HASH;
  const secret = process.env.ADMIN_TOKEN_SECRET;

  if (!hash || !secret) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server not configured' }) };
  }

  const valid = await bcrypt.compare(password, hash);
  if (!valid) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Invalid password' }) };
  }

  const token = signToken(secret);
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  };
}
