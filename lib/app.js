// app.js — request handler. Serves the CRM REST API (same shape as the
// frontend's js/api.js). Live entities come from Metabase; the rest use an
// in-memory store seeded from lib/seed.js.

const live = require('./live');
const seed = require('./seed');

const LIVE = {
  employers: live.employers,
  leads: live.leads,
  contacts: live.contacts,
  orders: live.orders,
  queries: live.queries,
  jobseekerSupports: live.jobseekerSupports,
  collections: live.collections,
  events: live.events,
  requirements: live.requirements
};

// in-memory store for seed-backed entities
const store = seed.build();

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
    deals: 'DEAL', visits: 'VISIT', collections: 'INV', campaigns: 'CAMP',
    requirements: 'REQ', proposals: 'PROP', payrollClients: 'PAY', vendors: 'VEND',
    events: 'EVENT', targets: 'TGT', dailyReports: 'REPORT'
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
  const parts = url.pathname.split('/').filter(Boolean); // e.g. ['api','employers','EMP-1']

  // allow /health and /api/health
  if (parts[0] === 'health') {
    return send(res, 200, { status: 'ok', service: 'nextjobz-crm-api' });
  }

  if (parts[0] !== 'api' || !parts[1]) {
    return send(res, 404, { error: 'Not found' });
  }

  if (parts[1] === 'health') {
    return send(res, 200, { status: 'ok', service: 'nextjobz-crm-api' });
  }

  if (parts[1] === 'dashboard') {
    try {
      const data = await live.dashboard();
      return send(res, 200, data);
    } catch (e) {
      return send(res, 500, { error: 'Could not load dashboard. ' + e.message });
    }
  }

  const entity = parts[1];
  const id = parts[2] ? decodeURIComponent(parts[2]) : undefined;
  const method = req.method || 'GET';

  try {
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
    return send(res, 500, { error: 'Could not save. Check your internet and try again.' });
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
