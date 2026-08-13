// auth.js — HMAC-signed session tokens + login.
// Username = Enroll ID, password = Enroll ID (per NJL requirement).

const crypto = require('crypto');
const { findByEnrollId, publicEmployee } = require('./employees');

const SECRET = process.env.AUTH_SECRET || 'nextjobz-dev-secret';
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function b64url(buf) {
  return Buffer.from(buf).toString('base64url');
}

function signToken(payload) {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', SECRET).update(header + '.' + body).digest('base64url');
  return header + '.' + body + '.' + sig;
}

function verifyToken(token) {
  try {
    const parts = String(token || '').split('.');
    if (parts.length !== 3) return null;
    const [h, b, s] = parts;
    const expect = crypto.createHmac('sha256', SECRET).update(h + '.' + b).digest('base64url');
    if (s.length !== expect.length) return null;
    if (!crypto.timingSafeEqual(Buffer.from(s), Buffer.from(expect))) return null;
    const payload = JSON.parse(Buffer.from(b, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

function login(username, password) {
  const emp = findByEnrollId(username);
  if (!emp) return null;
  if (String(password) !== emp.enrollId) return null;
  const token = signToken({ sub: emp.enrollId, exp: Date.now() + TTL_MS });
  return { token, employee: publicEmployee(emp) };
}

function employeeFromReq(req) {
  const header = (req.headers['authorization'] || req.headers['Authorization'] || '');
  const m = String(header).match(/^Bearer\s+(.+)$/i);
  if (!m) return null;
  const payload = verifyToken(m[1]);
  if (!payload || !payload.sub) return null;
  const emp = findByEnrollId(payload.sub);
  return emp ? publicEmployee(emp) : null;
}

module.exports = { login, verifyToken, employeeFromReq };
