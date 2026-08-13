// server.js — local development server (node server.js).
const http = require('http');
const { handle } = require('./lib/app');

const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => handle(req, res));
server.listen(PORT, () => {
  console.log('nextjobz-crm-api listening on http://localhost:' + PORT);
});
