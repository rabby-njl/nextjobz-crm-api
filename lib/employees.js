// employees.js — Nextjobz Limited employee directory.
// Login: username = Enroll ID, password = Enroll ID.
// `role` maps the employee to a CRM role (drives the personalized dashboard).

const EMPLOYEES = [
  { enrollId: '570884', name: 'Nasim Ahmed Maruf', designation: 'Manager - Training & Development', department: 'Nextjobz LearningLab (Operation)', status: 'Probationary Employee', phone: '01886545433', dob: '10/6/1988', bloodGroup: 'B+', email: 'nasimahmed@nextjobz.work', role: 'events_officer' },
  { enrollId: '571638', name: 'Md Mafizul Islam Muhin', designation: 'Manager', department: 'Operation', status: 'Probationary Employee', phone: '01794589116', dob: '1/1/1990', bloodGroup: 'B+', email: 'md.mafizulislam@akijresource.com', role: 'admin' },
  { enrollId: '568859', name: 'MD. Tanvir Ahmed', designation: 'Assistant Officer', department: 'Sales', status: 'Probationary Employee', phone: '01335172178', dob: '4/18/1990', bloodGroup: 'O+', email: 'tanvir@nextjobz.work', role: 'sales_officer' },
  { enrollId: '569194', name: 'Tazul Islam Rabby', designation: 'Manager', department: 'Marketing', status: 'Probationary Employee', phone: '01725786924', dob: '12/8/1991', bloodGroup: 'O-', email: 'rabby@nextjobz.work', role: 'marketing_officer' },
  { enrollId: '570731', name: 'Md Rubel Hossain', designation: 'Officer, Business Development & Strategic Operations', department: 'Operations', status: 'Probationary Employee', phone: '01521202170', dob: '4/16/1994', bloodGroup: 'O+', email: 'md.rubelhossain@nextjobz.work', role: 'recruiter' },
  { enrollId: '558474', name: 'Md. Mahadi Hassan', designation: 'Senior Officer', department: 'Marketing', status: 'Regular Employee', phone: '01335073638', dob: '5/1/1994', bloodGroup: 'O+', email: 'mahadi@nextjobz.work', role: 'marketing_officer' },
  { enrollId: '569975', name: 'Mohammad Badruddoza Luin', designation: 'Assistant Manager', department: 'Digital Marketing', status: 'Probationary Employee', phone: '01711084605', dob: '9/9/1994', bloodGroup: 'O+', email: 'badruddozaluin@nextjobz.work', role: 'marketing_officer' },
  { enrollId: '568863', name: 'Farjana Mahian Mahal', designation: 'Officer', department: 'Marketing', status: 'Regular Employee', phone: '01714703025', dob: '10/19/1994', bloodGroup: 'A+', email: 'mahal@nextjobz.work', role: 'marketing_officer' },
  { enrollId: '568826', name: 'MD. Rajaul Kabir', designation: 'Assistant Officer, Corporate Sales', department: 'Sales', status: 'Regular Employee', phone: '01335172177', dob: '3/12/1995', bloodGroup: 'B+', email: 'kabir@nextjobz.work', role: 'sales_officer' },
  { enrollId: '568475', name: 'Md. Omar Faruk', designation: 'Senior Officer', department: 'Sales', status: 'Regular Employee', phone: '01857668707', dob: '9/1/1995', bloodGroup: 'O+', email: 'omar@nextjobz.work', role: 'sales_officer' },
  { enrollId: '568476', name: 'Imdadul Haque', designation: 'Senior Officer', department: 'Sales & Marketing', status: 'Regular Employee', phone: '01728320729', dob: '3/8/1996', bloodGroup: 'B+', email: 'imdadul@nextjobz.work', role: 'sales_officer' },
  { enrollId: '567555', name: 'Asir Intesar Ibne Zaman', designation: 'Assistant Manager', department: 'Product & Technology', status: 'Regular Employee', phone: '01722050699', dob: '1/20/1998', bloodGroup: 'B+', email: 'asir@nextjobz.work', role: 'admin' },
  { enrollId: '568058', name: 'Md. Naimur Rahman', designation: 'Assistant Manager', department: 'Product and Tech', status: 'Regular Employee', phone: '01300772607', dob: '9/24/1998', bloodGroup: 'A+', email: 'naimur@nextjobz.work', role: 'admin' },
  { enrollId: '568818', name: 'Sumaya Akter', designation: 'Assistant Officer', department: 'Marketing', status: 'Regular Employee', phone: '01723652019', dob: '12/23/1998', bloodGroup: 'O+', email: 'sumaya@nextjobz.work', role: 'marketing_officer' },
  { enrollId: '568824', name: 'Md. Farhad Ali', designation: 'Assistant Officer', department: 'Sales', status: 'Probationary Employee', phone: '01773744682', dob: '1/25/1999', bloodGroup: 'A+', email: 'farhad@nextjobz.work', role: 'sales_officer' },
  { enrollId: '568816', name: 'Md Salim Mia', designation: 'Assistant Officer, Corporate Sales', department: 'Marketing', status: 'Regular Employee', phone: '01601022309', dob: '12/26/1999', bloodGroup: 'B+', email: 'salim@nextjobz.work', role: 'sales_officer' },
  { enrollId: '571136', name: 'Ziaul Haque Shadhin', designation: 'Assistant Officer (Event & Activation)', department: 'Event Management', status: 'Probationary Employee', phone: '01638381509', dob: '2/15/2000', bloodGroup: 'B+', email: 'ziaul@nextjobz.work', role: 'events_officer' },
  { enrollId: '571739', name: 'Sangida Jahan Ripa', designation: 'Intern', department: 'Finance and Operations', status: 'Intern', phone: '01994003814', dob: '9/29/2002', bloodGroup: 'A+', email: 'ripa@nextjobz.work', role: 'admin' },
  { enrollId: '569731', name: 'Sadia Afrin Mithila', designation: 'Officer, Event & Activation', department: 'Marketing', status: 'Probationary Employee', phone: '01306692969', dob: '11/13/2002', bloodGroup: 'A+', email: 'mithila@nextjobz.work', role: 'events_officer' },
  { enrollId: '571586', name: 'Musfiqur Rahman Ratun', designation: 'NextGen Intern', department: 'Marketing', status: 'Intern', phone: '01648902349', dob: '11/24/2002', bloodGroup: 'B+', email: 'ratun@nextjobz.work', role: 'marketing_officer' },
  { enrollId: '570215', name: 'Ashhab Chowdhury Prottoy', designation: 'MTO', department: 'Marketing - Brand', status: 'Probationary Employee', phone: '01755883449', dob: '7/19/2004', bloodGroup: 'O+', email: 'ashhabchowdhury@akijresource.com', role: 'marketing_officer' },
  { enrollId: '571781', name: 'Md. Mahbubul Hasan', designation: 'Officer - Learning and Development', department: 'Learning and Development', status: 'Probationary Employee', phone: '01785688651', dob: '3/3/1998', bloodGroup: 'O-', email: 'md.mahbub@nextjobz.work', role: 'events_officer' },
  { enrollId: '571790', name: 'Salman Ahmed', designation: 'Assistant Manager, Brand Marketing', department: 'Marketing', status: 'Probationary Employee', phone: '01534552036', dob: '6/28/1996', bloodGroup: 'B+', email: 'salmanahmed@nextjobz.work', role: 'marketing_officer' },
  { enrollId: '572013', name: 'Tahmida Alamgir', designation: 'Intern', department: 'IT', status: 'Intern', phone: '01521572511', dob: '6/12/2002', bloodGroup: 'O+', email: 'tahmida@nextjobz.work', role: 'admin' },
  { enrollId: '572550', name: 'Sanjida Islam', designation: 'Intern', department: 'Business Development', status: 'Intern', phone: '01315509277', dob: '12/31/2003', bloodGroup: 'A+', email: 'sanjida@nextjobz.work', role: 'recruiter' }
];

function findByEnrollId(id) {
  return EMPLOYEES.find((e) => e.enrollId === String(id).trim());
}

function publicEmployee(emp) {
  return {
    enrollId: emp.enrollId,
    name: emp.name,
    designation: emp.designation,
    department: emp.department,
    status: emp.status,
    phone: emp.phone,
    dob: emp.dob,
    bloodGroup: emp.bloodGroup,
    email: emp.email,
    role: emp.role
  };
}

module.exports = { EMPLOYEES, findByEnrollId, publicEmployee };
