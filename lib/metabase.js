// metabase.js — thin client over Metabase's native query (dataset) API.

const METABASE_URL = process.env.METABASE_URL || 'https://metabase.nextjobz.com.bd';
const METABASE_API_KEY = process.env.METABASE_API_KEY || '';
const DATABASE_ID = Number(process.env.METABASE_DATABASE_ID || 2);

async function runQuery(sql, parameters = []) {
  if (!METABASE_API_KEY) {
    throw new Error('METABASE_API_KEY is not configured');
  }
  // Cache-busting query param ensures we never get a stale HTTP/edge-cached
  // response; every call hits Metabase fresh.
  const res = await fetch(METABASE_URL + '/api/dataset?t=' + Date.now(), {
    method: 'POST',
    headers: {
      'x-api-key': METABASE_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      database: DATABASE_ID,
      type: 'native',
      native: { query: sql },
      parameters: parameters
    })
  });
  if (!res.ok) {
    throw new Error('Metabase responded ' + res.status);
  }
  const json = await res.json();
  if (json.error) {
    throw new Error(typeof json.error === 'string' ? json.error : JSON.stringify(json.error));
  }
  return json.data; // { rows: [[..]], cols: [{ name, ... }] }
}

function rowsToObjects(data) {
  const cols = (data.cols || []).map((c) => c.name);
  return (data.rows || []).map((row) => {
    const obj = {};
    cols.forEach((c, i) => { obj[c] = row[i]; });
    return obj;
  });
}

async function queryObjects(sql) {
  const data = await runQuery(sql);
  return rowsToObjects(data);
}

module.exports = { runQuery, rowsToObjects, queryObjects, METABASE_URL };
