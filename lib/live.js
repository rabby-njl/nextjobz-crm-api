// live.js — maps live Metabase (SQL Server) data into the CRM entity shapes
// that the frontend's js/api.js expects. Each entity exposes list() and get(id).

const { queryObjects } = require('./metabase');

function stripPrefix(id) {
  const m = String(id || '').match(/(\d+)$/);
  return m ? Number(m[1]) : null;
}

const SIZE_LABELS = {
  1: '1-10', 2: '11-50', 3: '51-200', 4: '201-500', 5: '501-1000', 6: '1000+'
};
function sizeLabel(n) {
  return SIZE_LABELS[n] || (n ? 'Size ' + n : '—');
}

function sliceDate(v) {
  return v ? String(v).slice(0, 10) : null;
}

const employers = {
  listSQL: `SELECT TOP 500
    IntId AS nid, strOrganizationame AS name, StrIndustry AS industry,
    intEmployeeSizeId AS size, strAddress AS address, strCity AS zone,
    strMobileNumber AS phone, strCompanyEmail AS email, isActive AS isActive,
    dteCreatedAt AS createdAt, dteUpdatedAt AS updatedAt
  FROM core.Account ORDER BY IntId DESC`,

  map(r) {
    return {
      id: 'EMP-' + r.nid,
      name: r.name || 'Unnamed company',
      industry: r.industry || '—',
      size: sizeLabel(r.size),
      address: r.address || '',
      zone: r.zone || '',
      phone: r.phone || '',
      email: r.email || '',
      salesperson: null,
      status: r.isActive ? 'active' : 'dormant',
      servicesUsed: [],
      lastContact: sliceDate(r.updatedAt) || sliceDate(r.createdAt)
    };
  },

  async list() {
    const rows = await queryObjects(this.listSQL);
    return rows.map((r) => this.map(r));
  },

  async get(id) {
    const n = stripPrefix(id);
    if (!n) return null;
    const rows = await queryObjects(
      `SELECT IntId AS nid, strOrganizationame AS name, StrIndustry AS industry,
        intEmployeeSizeId AS size, strAddress AS address, strCity AS zone,
        strMobileNumber AS phone, strCompanyEmail AS email, isActive AS isActive,
        dteCreatedAt AS createdAt, dteUpdatedAt AS updatedAt
       FROM core.Account WHERE IntId = ${n}`
    );
    return rows.length ? this.map(rows[0]) : null;
  }
};

const leads = {
  listSQL: `SELECT TOP 500
    IntId AS nid, StrCompanyName AS company, StrContact AS contactName,
    StrEmail AS email, StrLocation AS location, IsActive AS isActive,
    DteCreatedAt AS createdAt, DteUpdatedAt AS updatedAt
  FROM core.TblLeadCompany ORDER BY IntId DESC`,

  map(r) {
    return {
      id: 'LEAD-' + r.nid,
      company: r.company || 'Unnamed',
      contactName: r.contactName || '',
      phone: '',
      email: r.email || '',
      source: 'scrapped job follow-up',
      serviceInterest: null,
      routedTo: null,
      assignedTo: null,
      status: r.isActive ? 'new' : 'lost',
      note: r.location || '',
      createdAt: sliceDate(r.createdAt),
      lastActivityAt: sliceDate(r.updatedAt) || sliceDate(r.createdAt),
      lostReason: null,
      history: []
    };
  },

  async list() {
    const rows = await queryObjects(this.listSQL);
    return rows.map((r) => this.map(r));
  },

  async get(id) {
    const n = stripPrefix(id);
    if (!n) return null;
    const rows = await queryObjects(
      `SELECT IntId AS nid, StrCompanyName AS company, StrContact AS contactName,
        StrEmail AS email, StrLocation AS location, IsActive AS isActive,
        DteCreatedAt AS createdAt, DteUpdatedAt AS updatedAt
       FROM core.TblLeadCompany WHERE IntId = ${n}`
    );
    return rows.length ? this.map(rows[0]) : null;
  }
};

const contacts = {
  // Contacts = employer users (auth.Users type 2) linked to their company account.
  listSQL: `SELECT TOP 500
    u.IntId AS nid, a.strOrganizationame AS company, u.strDisplayName AS name,
    u.strPhoneNumber AS phone, u.strEmail AS email
  FROM auth.Users u
  LEFT JOIN core.Account a ON a.IntId = u.intAccountId
  WHERE u.intUserTypeId = 2
  ORDER BY u.IntId DESC`,

  map(r) {
    return {
      id: 'CONT-' + r.nid,
      company: r.company || '',
      name: r.name || '',
      designation: '',
      phone: r.phone || '',
      email: r.email || '',
      isPrimary: false
    };
  },

  async list() {
    const rows = await queryObjects(this.listSQL);
    return rows.map((r) => this.map(r));
  },

  async get(id) {
    const n = stripPrefix(id);
    if (!n) return null;
    const rows = await queryObjects(
      `SELECT u.IntId AS nid, a.strOrganizationame AS company, u.strDisplayName AS name,
        u.strPhoneNumber AS phone, u.strEmail AS email
       FROM auth.Users u
       LEFT JOIN core.Account a ON a.IntId = u.intAccountId
       WHERE u.IntId = ${n}`
    );
    return rows.length ? this.map(rows[0]) : null;
  }
};

const orders = {
  listSQL: `SELECT TOP 500
    IntId AS nid, strCompanyName AS employer, strJobTitle AS title,
    isActive AS isActive, isClosed AS isClosed, isPaid AS isPaid,
    dteStartDate AS startDate, dteEndDate AS endDate
  FROM hire.JobMaster ORDER BY IntId DESC`,

  map(r) {
    return {
      id: 'ORD-' + r.nid,
      employer: r.employer || '',
      service: r.isPaid ? 'Job Post - Premium' : 'Job Post - Basic',
      amount: 0,
      status: r.isClosed ? 'expired' : (r.isActive ? 'active' : 'pending'),
      startDate: sliceDate(r.startDate),
      endDate: sliceDate(r.endDate),
      officer: null
    };
  },

  async list() {
    const rows = await queryObjects(this.listSQL);
    return rows.map((r) => this.map(r));
  },

  async get(id) {
    const n = stripPrefix(id);
    if (!n) return null;
    const rows = await queryObjects(
      `SELECT IntId AS nid, strCompanyName AS employer, strJobTitle AS title,
        isActive AS isActive, isClosed AS isClosed, isPaid AS isPaid,
        dteStartDate AS startDate, dteEndDate AS endDate
       FROM hire.JobMaster WHERE IntId = ${n}`
    );
    return rows.length ? this.map(rows[0]) : null;
  }
};

const queries = {
  listSQL: `SELECT TOP 500
    intId AS nid, strName AS sender, strEmail AS email, strPhoneNo AS phone,
    strMessage AS message, dteCreatedAt AS createdAt
  FROM dbo.ContactUs ORDER BY intId DESC`,

  map(r) {
    return {
      id: 'Q-' + r.nid,
      channel: 'Platform',
      from: r.sender || '',
      type: 'employer query',
      subject: (r.message || '').slice(0, 80),
      assignedTo: null,
      company: null,
      status: 'open',
      email: r.email || '',
      phone: r.phone || '',
      createdAt: r.createdAt || new Date().toISOString()
    };
  },

  async list() {
    const rows = await queryObjects(this.listSQL);
    return rows.map((r) => this.map(r));
  },

  async get(id) {
    const n = stripPrefix(id);
    if (!n) return null;
    const rows = await queryObjects(
      `SELECT intId AS nid, strName AS sender, strEmail AS email, strPhoneNo AS phone,
        strMessage AS message, dteCreatedAt AS createdAt
       FROM dbo.ContactUs WHERE intId = ${n}`
    );
    return rows.length ? this.map(rows[0]) : null;
  }
};

const jobseekerSupports = {
  listSQL: `SELECT TOP 500
    intId AS nid, strFullName AS name, strPhoneNo AS phone,
    intProfileCompletePer AS completeness, dteUpdatedAt AS updatedAt
  FROM dbo.JobSeekerProfile WHERE isActive = 1 ORDER BY intId DESC`,

  map(r) {
    return {
      id: 'JS-' + r.nid,
      name: r.name || '',
      phone: r.phone || '',
      type: 'profile completion call',
      officer: null,
      date: sliceDate(r.updatedAt),
      outcome: (r.completeness || 0) > 50 ? 'profile completed' : 'CV updated'
    };
  },

  async list() {
    const rows = await queryObjects(this.listSQL);
    return rows.map((r) => this.map(r));
  },

  async get(id) {
    const n = stripPrefix(id);
    if (!n) return null;
    const rows = await queryObjects(
      `SELECT intId AS nid, strFullName AS name, strPhoneNo AS phone,
        intProfileCompletePer AS completeness, dteUpdatedAt AS updatedAt
       FROM dbo.JobSeekerProfile WHERE intId = ${n}`
    );
    return rows.length ? this.map(rows[0]) : null;
  }
};

const collections = {
  listSQL: `SELECT TOP 500
    Id AS nid, CustomerName AS employer, Amount AS amount, PayStatus AS payStatus,
    GatewayName AS method, PaymentProcessor AS processor, PaymentDate AS paymentDate
  FROM dbo.PaymentGatewayTransactionsForNextJobz ORDER BY Id DESC`,

  map(r) {
    const paid = String(r.payStatus || '').toUpperCase() === 'VALID';
    return {
      id: 'INV-' + r.nid,
      employer: r.employer || '',
      amount: Number(r.amount) || 0,
      dueDate: sliceDate(r.paymentDate),
      paidDate: paid ? sliceDate(r.paymentDate) : null,
      status: paid ? 'paid' : 'due',
      method: r.method || r.processor || ''
    };
  },

  async list() {
    const rows = await queryObjects(this.listSQL);
    return rows.map((r) => this.map(r));
  },

  async get(id) {
    const n = stripPrefix(id);
    if (!n) return null;
    const rows = await queryObjects(
      `SELECT Id AS nid, CustomerName AS employer, Amount AS amount, PayStatus AS payStatus,
        GatewayName AS method, PaymentProcessor AS processor, PaymentDate AS paymentDate
       FROM dbo.PaymentGatewayTransactionsForNextJobz WHERE Id = ${n}`
    );
    return rows.length ? this.map(rows[0]) : null;
  }
};

const events = {
  listSQL: `SELECT TOP 500
    f.intId AS nid, a.strOrganizationame AS organisation, f.dteCreatedAt AS createdAt
  FROM fair.tblJobFairCompany f
  LEFT JOIN core.Account a ON a.IntId = f.intAccountId
  ORDER BY f.intId DESC`,

  map(r) {
    return {
      id: 'EVENT-' + r.nid,
      organisation: r.organisation || '',
      eventType: 'job fair',
      proposedDate: sliceDate(r.createdAt),
      value: 0,
      status: 'new',
      owner: 'Events One',
      source: 'CRM team'
    };
  },

  async list() {
    const rows = await queryObjects(this.listSQL);
    return rows.map((r) => this.map(r));
  },

  async get(id) {
    const n = stripPrefix(id);
    if (!n) return null;
    const rows = await queryObjects(
      `SELECT f.intId AS nid, a.strOrganizationame AS organisation, f.dteCreatedAt AS createdAt
       FROM fair.tblJobFairCompany f
       LEFT JOIN core.Account a ON a.IntId = f.intAccountId
       WHERE f.intId = ${n}`
    );
    return rows.length ? this.map(rows[0]) : null;
  }
};

const requirements = {
  listSQL: `SELECT TOP 500
    IntId AS nid, strCompanyName AS client, strJobTitle AS position,
    intVacancy AS headcount, isDraft AS isDraft, isReviewed AS isReviewed,
    isClosed AS isClosed, dteCreatedAt AS createdAt
  FROM hire.JobMaster
  WHERE (isScrapped IS NULL OR isScrapped = 0)
  ORDER BY IntId DESC`,

  map(r) {
    return {
      id: 'REQ-' + r.nid,
      client: r.client || '',
      position: r.position || '',
      serviceType: 'Headhunting / RPO',
      headcount: Number(r.headcount) || 1,
      recruiter: null,
      stage: r.isClosed ? 'cancelled' : (r.isReviewed ? 'posted' : 'JD ready'),
      dateOpened: sliceDate(r.createdAt),
      pipeline: { applied: 0, screened: 0, shortlisted: 0, interviewed: 0, sentToClient: 0, selected: 0, joined: 0 }
    };
  },

  async list() {
    const rows = await queryObjects(this.listSQL);
    return rows.map((r) => this.map(r));
  },

  async get(id) {
    const n = stripPrefix(id);
    if (!n) return null;
    const rows = await queryObjects(
      `SELECT IntId AS nid, strCompanyName AS client, strJobTitle AS position,
        intVacancy AS headcount, isDraft AS isDraft, isReviewed AS isReviewed,
        isClosed AS isClosed, dteCreatedAt AS createdAt
       FROM hire.JobMaster WHERE IntId = ${n}`
    );
    return rows.length ? this.map(rows[0]) : null;
  }
};

const trainings = {
  mapCourseStatus(courseStatus, isUpcoming) {
    if (courseStatus === 'Closed') return 'completed';
    if (courseStatus === 'Draft') return 'planned';
    return isUpcoming ? 'planned' : 'ongoing';
  },

  async list() {
    const courses = await queryObjects(`SELECT TOP 300
      intId AS nid, strTitle AS title, strTrainingInstructorName AS trainer,
      numFee AS fee, intEnrolledSeats AS enrolled, intTotalSeats AS seats,
      dteStartDate AS startDate, dteEndDate AS endDate, strStatus AS courseStatus,
      strTrainingMode AS mode, isUpcoming AS isUpcoming
    FROM dbo.TrainingCourse ORDER BY intId DESC`);

    const requests = await queryObjects(`SELECT TOP 300
      intId AS nid, strCompanyName AS company, strTeamSize AS teamSize,
      strTrainingFocus AS focus, strAdditionalNotes AS notes, strContactEmail AS email,
      strPhoneNumber AS phone, dteCreatedAt AS createdAt
    FROM dbo.CorporateTrainingRequests ORDER BY intId DESC`);

    const out = [];

    courses.forEach((c) => {
      const fee = Number(c.fee) || 0;
      const enrolled = Number(c.enrolled) || 0;
      const seats = Number(c.seats) || 0;
      out.push({
        id: 'TRN-' + c.nid,
        title: c.title || '',
        type: fee > 0 ? 'External Training' : 'Internal Training',
        client: '',
        trainer: c.trainer || '',
        participants: enrolled,
        revenue: fee * enrolled,
        startDate: sliceDate(c.startDate),
        endDate: sliceDate(c.endDate),
        status: this.mapCourseStatus(c.courseStatus, c.isUpcoming),
        owner: 'Nasim Ahmed Maruf',
        note: (c.mode || '') + ' · ' + enrolled + '/' + seats + ' seats enrolled'
      });
    });

    requests.forEach((r) => {
      out.push({
        id: 'CORP-' + r.nid,
        title: r.focus || 'Corporate training',
        type: 'External Training',
        client: r.company || '',
        trainer: '',
        participants: parseInt(r.teamSize, 10) || 0,
        revenue: 0,
        startDate: sliceDate(r.createdAt),
        endDate: null,
        status: 'planned',
        owner: 'Nasim Ahmed Maruf',
        note: [r.notes, r.email, r.phone].filter(Boolean).join(' · ')
      });
    });

    return out;
  },

  async get(id) {
    const list = await this.list();
    return list.find((x) => x.id === id) || null;
  }
};

async function dashboard() {
  const kpis = [
    ['total_users', `SELECT COUNT(*) FROM auth.Users`],
    ['employers', `SELECT COUNT(*) FROM auth.Users WHERE intUserTypeId = 2`],
    ['job_seekers', `SELECT COUNT(*) FROM auth.Users WHERE intUserTypeId = 1`],
    ['active_js_profiles', `SELECT COUNT(*) FROM auth.Users u JOIN dbo.JobSeekerProfile jsp ON u.IntId = jsp.IntUserId WHERE u.intUserTypeId = 1 AND jsp.isActive = 1`],
    ['cv_0_50', `SELECT COUNT(*) FROM auth.Users u JOIN dbo.JobSeekerProfile jsp ON u.IntId = jsp.IntUserId WHERE u.intUserTypeId = 1 AND jsp.isActive = 1 AND jsp.intProfileCompletePer <= 50`],
    ['cv_51_100', `SELECT COUNT(*) FROM auth.Users u JOIN dbo.JobSeekerProfile jsp ON u.IntId = jsp.IntUserId WHERE u.intUserTypeId = 1 AND jsp.isActive = 1 AND jsp.intProfileCompletePer > 50`],
    ['jobs_posted', `SELECT COUNT(*) FROM hire.JobMaster WHERE isActive = 1 AND isReviewed = 1 AND (isDraft IS NULL OR isDraft = 0) AND (isClosed IS NULL OR isClosed = 0) AND (isHold IS NULL OR isHold = 0)`],
    ['jobs_applied', `SELECT COUNT(*) FROM dbo.JobApplication WHERE isActive = 1`]
  ];
  const out = {};
  for (const [key, sql] of kpis) {
    try {
      const data = await queryObjects(sql);
      out[key] = data.length && data[0][Object.keys(data[0])[0]];
    } catch (e) {
      out[key] = null;
    }
  }
  return out;
}

module.exports = {
  employers,
  leads,
  contacts,
  orders,
  queries,
  jobseekerSupports,
  collections,
  events,
  requirements,
  trainings,
  dashboard
};
