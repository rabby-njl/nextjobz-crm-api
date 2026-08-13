// trainings.js — LearningLab training business module seed.
// Covers internal, external and government/public training businesses.

const TRAINING_TYPES = ['Internal Training', 'External Training', 'Government / Public Training'];
const TRAINING_STATUSES = ['planned', 'ongoing', 'completed', 'cancelled'];

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

const TRAININGS = [
  { id: 'TRN-001', title: 'Leadership Essentials for Team Leads', type: 'Internal Training', client: 'Nextjobz Limited', trainer: 'Nasim Ahmed Maruf', participants: 24, revenue: 0, startDate: daysFromNow(10), endDate: daysFromNow(11), status: 'planned', owner: 'Nasim Ahmed Maruf', note: 'Internal capability building for team leads.' },
  { id: 'TRN-002', title: 'Corporate Sales Excellence Bootcamp', type: 'External Training', client: 'Demo Textiles Ltd', trainer: 'Nasim Ahmed Maruf', participants: 18, revenue: 150000, startDate: daysFromNow(20), endDate: daysFromNow(22), status: 'planned', owner: 'Nasim Ahmed Maruf', note: 'Paid external training for a corporate client.' },
  { id: 'TRN-003', title: 'Government HR Digitization Workshop', type: 'Government / Public Training', client: 'Government Agency (Demo)', trainer: 'Tazul Islam Rabby', participants: 60, revenue: 450000, startDate: daysFromNow(30), endDate: daysFromNow(31), status: 'planned', owner: 'Tazul Islam Rabby', note: 'Public-sector training program.' },
  { id: 'TRN-004', title: 'Train the Trainer - Induction', type: 'Internal Training', client: 'Nextjobz Limited', trainer: 'Md. Mahbubul Hasan', participants: 10, revenue: 0, startDate: daysAgo(5), endDate: daysAgo(4), status: 'completed', owner: 'Md. Mahbubul Hasan', note: 'New trainer onboarding.' },
  { id: 'TRN-005', title: 'Digital Marketing Fundamentals', type: 'External Training', client: 'Sample Pharma BD', trainer: 'Nasim Ahmed Maruf', participants: 32, revenue: 220000, startDate: daysAgo(15), endDate: daysAgo(12), status: 'completed', owner: 'Nasim Ahmed Maruf', note: 'Corporate digital marketing program.' },
  { id: 'TRN-006', title: 'Public Service Soft Skills Program', type: 'Government / Public Training', client: 'Municipality Office (Demo)', trainer: 'Tazul Islam Rabby', participants: 45, revenue: 300000, startDate: daysAgo(2), endDate: daysFromNow(3), status: 'ongoing', owner: 'Tazul Islam Rabby', note: 'Ongoing public-sector cohort.' },
  { id: 'TRN-007', title: 'Recruitment Interviewing Skills', type: 'Internal Training', client: 'Nextjobz Limited', trainer: 'Md Mafizul Islam Muhin', participants: 16, revenue: 0, startDate: daysAgo(30), endDate: daysAgo(30), status: 'completed', owner: 'Md Mafizul Islam Muhin', note: 'Internal training for the recruitment team.' },
  { id: 'TRN-008', title: 'Sales Onboarding - New Joinees', type: 'Internal Training', client: 'Nextjobz Limited', trainer: 'Nasim Ahmed Maruf', participants: 12, revenue: 0, startDate: daysFromNow(5), endDate: daysFromNow(7), status: 'ongoing', owner: 'Nasim Ahmed Maruf', note: 'New sales team onboarding.' }
];

module.exports = { TRAININGS, TRAINING_TYPES, TRAINING_STATUSES };
