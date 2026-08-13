// seed.js — fake seed data for CRM entities that have no live Metabase mapping yet
// (deals, visits, collections, campaigns, requirements, proposals, payroll,
// vendors, events, targets, daily reports). Shapes match the frontend api.js.

function pad(n) {
  return String(n).padStart(3, '0');
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

const COMPANIES = [
  'Demo Textiles Ltd', 'Sample Pharma BD', 'Test Garments Group', 'Example Foods Ltd',
  'Placeholder Bank PLC', 'Dummy Agro Industries', 'Fake Fashion House', 'Mock Electronics Co'
];

const OFFICERS = ['Officer One', 'Officer Two', 'Officer Three', 'Officer Four'];

function makeDeals() {
  const stages = ['prospecting', 'demo', 'quotation', 'negotiation', 'won', 'lost'];
  const out = [];
  for (let i = 0; i < 12; i++) {
    out.push({
      id: 'DEAL-' + pad(i + 1),
      employer: COMPANIES[i % COMPANIES.length],
      service: 'Job Post - Basic',
      stage: stages[i % stages.length],
      value: 50000 + ((i * 37000) % 400000),
      officer: OFFICERS[i % OFFICERS.length],
      expectedClose: daysFromNow((i * 5) % 45),
      lastActivity: daysAgo((i * 3) % 14)
    });
  }
  return out;
}

function makeVisits() {
  const types = ['field visit', 'online meeting', 'phone call'];
  const out = [];
  for (let i = 0; i < 12; i++) {
    out.push({
      id: 'VISIT-' + pad(i + 1),
      employer: COMPANIES[i % COMPANIES.length],
      date: daysAgo(i % 14),
      type: types[i % types.length],
      officer: OFFICERS[i % OFFICERS.length],
      outcome: ['meeting held', 'demo given', 'follow-up planned', 'no show'][i % 4],
      nextStep: ['send proposal', 'call back', 'schedule demo', 'close deal'][i % 4]
    });
  }
  return out;
}

function makeCollections() {
  const statuses = ['due', 'partial', 'paid'];
  const methods = ['bKash', 'Nagad', 'bank transfer', 'cheque', 'cash'];
  const out = [];
  for (let i = 0; i < 12; i++) {
    const status = statuses[i % statuses.length];
    out.push({
      id: 'INV-' + pad(i + 1),
      employer: COMPANIES[i % COMPANIES.length],
      amount: 10000 + ((i * 21000) % 300000),
      dueDate: daysAgo((i * 2) % 60),
      paidDate: status === 'paid' ? daysAgo(i % 30) : (status === 'partial' ? daysAgo(i % 10) : null),
      status: status,
      method: methods[i % methods.length]
    });
  }
  return out;
}

function makeCampaigns() {
  const channels = ['Meta Ads', 'Google Ads', 'Organic Social', 'SEO', 'Email'];
  const out = [];
  for (let i = 0; i < 6; i++) {
    const spend = 20000 + ((i * 15000) % 120000);
    const generated = 40 + ((i * 13) % 180);
    out.push({
      id: 'CAMP-' + pad(i + 1),
      campaign: 'Campaign ' + String.fromCharCode(65 + i),
      channel: channels[i % channels.length],
      status: i % 4 === 3 ? 'paused' : 'running',
      spend: spend,
      leadsGenerated: generated,
      start: daysAgo(i % 60),
      end: daysFromNow(30 - (i % 20))
    });
  }
  return out;
}

function makeRequirements() {
  const serviceTypes = ['Headhunting / RPO', 'Staffing Solution', 'Campus Hiring'];
  const stages = ['JD pending', 'JD ready', 'posted', 'screening', 'interviewing', 'shortlist sent', 'offer stage', 'placed', 'cancelled'];
  const positions = ['Sales Executive', 'Accounts Officer', 'Production Supervisor', 'HR Officer', 'IT Support', 'Marketing Executive'];
  const out = [];
  for (let i = 0; i < 8; i++) {
    out.push({
      id: 'REQ-' + pad(i + 1),
      client: COMPANIES[(i + 2) % COMPANIES.length],
      position: positions[i % positions.length],
      serviceType: serviceTypes[i % serviceTypes.length],
      headcount: 1 + ((i * 3) % 12),
      recruiter: 'Recruiter One',
      stage: stages[i % stages.length],
      dateOpened: daysAgo((i * 4) % 30),
      pipeline: { applied: 10, screened: 6, shortlisted: 4, interviewed: 3, sentToClient: 2, selected: 1, joined: 0 }
    });
  }
  return out;
}

function makeProposals() {
  const statuses = ['draft', 'sent', 'under review', 'won', 'lost'];
  const out = [];
  for (let i = 0; i < 8; i++) {
    out.push({
      id: 'PROP-' + pad(i + 1),
      client: COMPANIES[(i + 3) % COMPANIES.length],
      service: 'Headhunting / RPO',
      value: 100000 + ((i * 55000) % 700000),
      sentDate: daysAgo(i % 30),
      status: statuses[i % statuses.length],
      owner: 'Recruiter One'
    });
  }
  return out;
}

function makePayrollClients() {
  const cycles = ['data pending', 'processing', 'ready for approval', 'disbursed'];
  const out = [];
  for (let i = 0; i < 4; i++) {
    out.push({
      id: 'PAY-' + pad(i + 1),
      clientName: COMPANIES[(i + 5) % COMPANIES.length],
      contractStart: daysAgo((i * 30) % 300),
      headcount: 20 + ((i * 17) % 400),
      cycleStatus: cycles[i % cycles.length],
      monthlyFee: 30000 + ((i * 12000) % 90000),
      owner: 'Payroll One'
    });
  }
  return out;
}

function makeVendors() {
  const names = ['Demo Creative Studio', 'Sample Media House', 'Test SEO Agency', 'Placeholder Print Co', 'Mock Video House', 'Fake Content Lab'];
  const types = ['content', 'creative', 'SEO', 'media buying', 'other'];
  const statuses = ['received', 'verified', 'forwarded for approval', 'paid'];
  const out = [];
  for (let i = 0; i < 8; i++) {
    out.push({
      id: 'VEND-' + pad(i + 1),
      vendor: names[i % names.length],
      serviceType: types[i % types.length],
      billMonth: new Date().toISOString().slice(0, 7),
      amount: 5000 + ((i * 12000) % 150000),
      status: statuses[i % statuses.length],
      verifiedBy: i % 3 === 0 ? 'Marketing One' : null
    });
  }
  return out;
}

function makeEvents() {
  const types = ['job fair', 'campus activation', 'corporate event', 'roadshow', 'training event'];
  const statuses = ['new', 'proposal sent', 'confirmed', 'completed', 'cancelled'];
  const out = [];
  for (let i = 0; i < 8; i++) {
    out.push({
      id: 'EVENT-' + pad(i + 1),
      organisation: COMPANIES[(i + 1) % COMPANIES.length],
      eventType: types[i % types.length],
      proposedDate: daysFromNow((i * 6) % 60),
      value: 50000 + ((i * 45000) % 700000),
      status: statuses[i % statuses.length],
      owner: 'Events One',
      source: i % 3 === 2 ? 'marketing' : 'CRM team'
    });
  }
  return out;
}

function makeTargets() {
  const out = [];
  for (let o = 0; o < 4; o++) {
    out.push({
      id: 'TGT-' + pad(o + 1),
      officer: OFFICERS[o],
      month: new Date().toISOString().slice(0, 7),
      targetSales: 200000 + ((o * 75000) % 400000),
      targetVisits: 20 + ((o * 7) % 20),
      targetNewEmployers: 5 + ((o * 3) % 10),
      targetLeads: 30 + ((o * 9) % 30)
    });
  }
  return out;
}

function makeDailyReports() {
  const out = [];
  for (let i = 0; i < 6; i++) {
    out.push({
      id: 'REPORT-' + pad(i + 1),
      officer: OFFICERS[i % OFFICERS.length],
      date: daysAgo(i + 1),
      note: 'Seed report',
      stats: { visits: i % 5, calls: i % 7, leads: i % 3, dealsMoved: i % 2, invoices: i % 2 },
      submittedAt: new Date(Date.now() - (i + 1) * 86400000).toISOString()
    });
  }
  return out;
}

function build() {
  return {
    deals: makeDeals(),
    visits: makeVisits(),
    campaigns: makeCampaigns(),
    proposals: makeProposals(),
    payrollClients: makePayrollClients(),
    vendors: makeVendors(),
    targets: makeTargets(),
    dailyReports: makeDailyReports()
  };
}

module.exports = { build };
