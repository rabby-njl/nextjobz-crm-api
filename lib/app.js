// app.js — request handler. Serves the CRM REST API (same shape as the
// frontend's js/api.js). Live entities come from Metabase. All data routes
// require a valid session (Bearer token); non-live entities start empty.

const live = require('./live');
const auth = require('./auth');
const { EMPLOYEES, publicEmployee } = require('./employees');

const LIVE = {
  employers: live.employers,
  leads: live.leads,
  contacts: live.contacts,
  orders: live.orders,
  queries: live.queries,
  jobseekerSupports: live.jobseekerSupports,
  collections: live.collections,
  events: live.events,
  requirements: live.requirements,
  trainings: live.trainings
};

// Entities with no live source yet (start empty).
const SEED_ENTITIES = [
  'deals', 'visits', 'campaigns', 'proposals', 'payrollClients', 'vendors', 'targets', 'dailyReports'
];
const store = {};
SEED_ENTITIES.forEach((n) => { store[n] = []; });

function send(res, status, obj) {
  const body = JSON.stringify(obj);
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => { data += c; });
    req.on('end', () => {
      if (!data) return resolve({});
      try { resolve(JSON.parse(data)); } catch (e) { resolve({}); }
    });
  });
}

function nextId(entity, list) {
  const prefixes = {
    deals: 'DEAL', visits: 'VISIT', campaigns: 'CAMP', proposals: 'PROP',
    payrollClients: 'PAY', vendors: 'VEND', targets: 'TGT', dailyReports: 'REPORT', trainings: 'TRN'
  };
  const prefix = prefixes[entity] || 'ID';
  let max = 0;
  list.forEach((it) => {
    const m = String(it.id).match(/(\d+)$/);
    if (m) max = Math.max(max, Number(m[1]));
  });
  return prefix + '-' + String(max + 1).padStart(3, '0');
}

async function handle(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
    return res.end();
  }

  const url = new URL(req.url, 'http://localhost');
  const parts = url.pathname.split('/').filter(Boolean);

  if (parts[0] === 'health' || (parts[0] === 'api' && parts[1] === 'health')) {
    return send(res, 200, { status: 'ok', service: 'nextjobz-crm-api' });
  }

  if (parts[0] !== 'api' || !parts[1]) {
    return send(res, 404, { error: 'Not found' });
  }

  // Auth endpoints (public login + session check). Note: /api/auth/* is
  // reserved by Vercel's SSO, so we use /api/login and /api/me.
  if (parts[1] === 'login' && req.method === 'POST') {
    const body = await readBody(req);
    const result = auth.login(body.username, body.password);
    if (!result) return send(res, 401, { error: 'Invalid Enroll ID or password' });
    return send(res, 200, result);
  }
  if (parts[1] === 'me' && req.method === 'GET') {
    const emp = auth.employeeFromReq(req);
    if (!emp) return send(res, 401, { error: 'Unauthorized' });
    return send(res, 200, emp);
  }

  // Protect every data route
  const employee = auth.employeeFromReq(req);
  if (!employee) return send(res, 401, { error: 'Unauthorized' });

  const entity = parts[1];
  const id = parts[2] ? decodeURIComponent(parts[2]) : undefined;
  const method = req.method || 'GET';

  try {
    if (entity === 'dashboard') {
      const data = await live.dashboard();
      return send(res, 200, data);
    }
    if (entity === 'employees') {
      return send(res, 200, EMPLOYEES.map(publicEmployee));
    }
    if (LIVE[entity]) {
      await handleLive(res, method, LIVE[entity], id, await readBody(req));
      return;
    }
    if (store[entity]) {
      handleSeed(res, method, entity, id, await readBody(req));
      return;
    }
    return send(res, 404, { error: 'Unknown entity: ' + entity });
  } catch (e) {
    console.error('API error', entity, e);
    return send(res, 500, { error: 'Could not load. Check your internet and try again.' });
  }
}

async function handleLive(res, method, impl, id, body) {
  if (method === 'GET') {
    if (id) {
      const item = await impl.get(id);
      return item ? send(res, 200, item) : send(res, 404, { error: 'Not found' });
    }
    const list = await impl.list();
    return send(res, 200, list);
  }
  if (method === 'POST') {
    const item = Object.assign({ id: 'LIVE-' + Date.now() }, body || {});
    return send(res, 201, Object.assign(item, { _readOnly: true, _note: 'Live entity — writes are not persisted to the source system.' }));
  }
  if (method === 'PUT') {
    return send(res, 200, Object.assign({ id: id }, body || {}, { _readOnly: true, _note: 'Live entity — writes are not persisted.' }));
  }
  if (method === 'DELETE') {
    return send(res, 200, { ok: true, _note: 'Live entity — writes are not persisted.' });
  }
  return send(res, 405, { error: 'Method not allowed' });
}

function handleSeed(res, method, entity, id, body) {
  const list = store[entity];
  if (method === 'GET') {
    if (id) {
      const item = list.find((x) => x.id === id);
      return item ? send(res, 200, item) : send(res, 404, { error: 'Not found' });
    }
    return send(res, 200, list);
  }
  if (method === 'POST') {
    const item = Object.assign({}, body || {});
    item.id = nextId(entity, list);
    list.push(item);
    return send(res, 201, item);
  }
  if (method === 'PUT') {
    const idx = list.findIndex((x) => x.id === id);
    if (idx === -1) return send(res, 404, { error: 'Not found' });
    list[idx] = Object.assign({}, list[idx], body || {}, { id: id });
    return send(res, 200, list[idx]);
  }
  if (method === 'DELETE') {
    const idx = list.findIndex((x) => x.id === id);
    if (idx === -1) return send(res, 404, { error: 'Not found' });
    list.splice(idx, 1);
    return send(res, 200, { ok: true });
  }
  return send(res, 405, { error: 'Method not allowed' });
}

module.exports = { handle };
