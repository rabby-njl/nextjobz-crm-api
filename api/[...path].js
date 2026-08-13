// api/[...path].js — Vercel serverless catch-all for the CRM API.
const { handle } = require('../lib/app');

module.exports = function (req, res) {
  return handle(req, res);
};
