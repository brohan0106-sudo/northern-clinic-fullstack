const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');

const DEMO_PASSWORD = 'Clinic#2026';

function hashSync(pw) {
  return bcrypt.hashSync(pw, 10);
}

function buildSeedData() {
  const pwHash = hashSync(DEMO_PASSWORD);

  const users = [
    { id: uuid(), username: 'admin.user', passwordHash: pwHash, name: 'Admin User', role: 'admin', initials: 'AU', failedLogins: 0, lockedUntil: null },
    { id: uuid(), username: 'r.nguyen', passwordHash: pwHash, name: 'R. Nguyen', role: 'reception', initials: 'RN', failedLogins: 0, lockedUntil: null },
    { id: uuid(), username: 'dr.osei', passwordHash: pwHash, name: 'Dr. A. Osei', role: 'clinician', initials: 'AO', failedLogins: 0, lockedUntil: null },
    { id: uuid(), username: 'dr.ibrahim', passwordHash: pwHash, name: 'Dr. H. Ibrahim', role: 'clinician', initials: 'HI', failedLogins: 0, lockedUntil: null },
    { id: uuid(), username: 'dr.nasser', passwordHash: pwHash, name: 'Dr. F. Nasser', role: 'clinician', initials: 'FN', failedLogins: 0, lockedUntil: null },
    { id: uuid(), username: 'k.patel', passwordHash: pwHash, name: 'K. Patel', role: 'billing', initials: 'KP', failedLogins: 0, lockedUntil: null },
    { id: uuid(), username: 'm.alvarez', passwordHash: pwHash, name: 'M. Alvarez', role: 'patient', initials: 'MA', failedLogins: 0, lockedUntil: null },
    { id: uuid(), username: 't.nguyen', passwordHash: pwHash, name: 'T. Nguyen', role: 'patient', initials: 'TN', failedLogins: 0, lockedUntil: null },
    { id: uuid(), username: 's.haddad', passwordHash: pwHash, name: 'S. Haddad', role: 'patient', initials: 'SH', failedLogins: 0, lockedUntil: null },
  ];

  const patients = [
    { id: '4482', name: 'M. Alvarez', dob: '14 Mar 1985', phone: '0412 889 012', allergies: 'Penicillin', lastVisit: '22 Jul 2026', flag: 'cardiology', insurancePayer: 'Medibank', policyNumber: 'MB-88213', emergencyContact: 'Carlos Alvarez (0412 990 111)' },
    { id: '4519', name: 'T. Nguyen', dob: '02 Nov 1992', phone: '0423 102 334', allergies: 'None known', lastVisit: 'New patient', flag: 'new', insurancePayer: 'Bupa', policyNumber: 'BU-40921', emergencyContact: 'Lien Nguyen (0423 881 992)' },
    { id: '4390', name: 'S. Haddad', dob: '19 Jun 1958', phone: '0401 554 821', allergies: 'Sulfa drugs', lastVisit: '30 Jun 2026', flag: 'chronic', insurancePayer: 'Medicare', policyNumber: 'MC-11734', emergencyContact: 'Farah Haddad (0401 223 900)' },
    { id: '4601', name: 'B. Okafor', dob: '08 Jan 1997', phone: '0455 332 198', allergies: 'None known', lastVisit: '05 Jul 2026', flag: 'maternity', insurancePayer: 'Bupa', policyNumber: 'BU-55110', emergencyContact: 'Chidi Okafor (0455 889 123)' },
    { id: '4237', name: 'L. Tran', dob: '27 Sep 1970', phone: '0418 776 220', allergies: 'Latex', lastVisit: '11 Jul 2026', flag: 'cardiology', insurancePayer: 'Medicare', policyNumber: 'MC-99820', emergencyContact: 'Minh Tran (0418 221 445)' },
    { id: '4702', name: 'D. Petrova', dob: '04 Dec 1980', phone: '0499 112 400', allergies: 'Aspirin', lastVisit: '18 Jul 2026', flag: 'none', insurancePayer: 'HCF', policyNumber: 'HC-33109', emergencyContact: 'Ivan Petrova (0499 001 223)' },
    { id: '4811', name: 'J. Smith', dob: '11 Aug 1964', phone: '0477 665 443', allergies: 'Codeine', lastVisit: '02 Aug 2026', flag: 'chronic', insurancePayer: 'Medibank', policyNumber: 'MB-99120', emergencyContact: 'Sarah Smith (0477 334 112)' },
    { id: '4925', name: 'E. Clarke', dob: '23 Feb 2001', phone: '0434 221 009', allergies: 'Peanuts', lastVisit: '04 Aug 2026', flag: 'pediatric', insurancePayer: 'NIB', policyNumber: 'NI-77182', emergencyContact: 'Helen Clarke (0434 998 120)' },
  ];

  const doctors = [
    { id: uuid(), name: 'Dr. A. Osei', specialization: 'General Practice & Cardiology', department: 'Cardiology', fee: 180.00, availableDays: 'Mon, Tue, Thu, Fri', slots: ['9:00 AM', '9:30 AM', '10:30 AM', '1:00 PM'], bio: 'Senior Consultant Cardiologist with 14 years experience.' },
    { id: uuid(), name: 'Dr. H. Ibrahim', specialization: 'Pediatrics & Chronic Care', department: 'Pediatrics', fee: 160.00, availableDays: 'Mon, Wed, Fri', slots: ['10:00 AM', '11:00 AM', '2:00 PM'], bio: 'Specialist Pediatrician & Family Health Consultant.' },
    { id: uuid(), name: 'Dr. F. Nasser', specialization: 'Obstetrics & Gynecology', department: 'Obstetrics & Maternity', fee: 220.00, availableDays: 'Tue, Wed, Thu', slots: ['11:15 AM', '1:30 PM', '3:00 PM'], bio: 'Lead Specialist in Maternal Health and Prenatal Ultrasound.' },
    { id: uuid(), name: 'Dr. K. Zhou', specialization: 'Orthopedics & Sports Medicine', department: 'Outpatient General', fee: 200.00, availableDays: 'Mon, Thu', slots: ['9:15 AM', '11:00 AM', '2:30 PM'], bio: 'Orthopedic Consultant specializing in joint rehabilitation.' },
    { id: uuid(), name: 'Dr. E. Taylor', specialization: 'Diagnostic Radiology', department: 'Radiology & Imaging', fee: 250.00, availableDays: 'Mon, Tue, Wed, Thu, Fri', slots: ['8:30 AM', '10:30 AM', '1:30 PM'], bio: 'Senior Radiologist in CT, MRI, and X-Ray diagnostics.' },
  ];

  const departments = [
    { id: 'dept-1', name: 'Outpatient General', head: 'Dr. K. Zhou', phone: 'Ext 101', floor: 'Level 1, Block A' },
    { id: 'dept-2', name: 'Cardiology', head: 'Dr. A. Osei', phone: 'Ext 102', floor: 'Level 2, Block B' },
    { id: 'dept-3', name: 'Pediatrics', head: 'Dr. H. Ibrahim', phone: 'Ext 103', floor: 'Level 1, Block C' },
    { id: 'dept-4', name: 'Obstetrics & Maternity', head: 'Dr. F. Nasser', phone: 'Ext 104', floor: 'Level 3, Block A' },
    { id: 'dept-5', name: 'Radiology & Imaging', head: 'Dr. E. Taylor', phone: 'Ext 105', floor: 'Ground Floor, Block B' },
    { id: 'dept-6', name: 'Pharmacy Dispensary', head: 'Pharm. R. Sharma', phone: 'Ext 106', floor: 'Ground Floor, Foyer' },
  ];

  const appointments = [
    { id: uuid(), time: '9:00 AM', patient: 'M. Alvarez', clinician: 'Dr. Osei', type: 'Follow-up', status: 'Checked in', department: 'Cardiology', date: '2026-08-08' },
    { id: uuid(), time: '9:30 AM', patient: 'T. Nguyen', clinician: 'Dr. Osei', type: 'New patient', status: 'Waiting', department: 'Outpatient General', date: '2026-08-08' },
    { id: uuid(), time: '10:00 AM', patient: 'S. Haddad', clinician: 'Dr. Ibrahim', type: 'Chronic disease review', status: 'Scheduled', department: 'Pediatrics', date: '2026-08-08' },
    { id: uuid(), time: '10:30 AM', patient: 'B. Okafor', clinician: 'Dr. Osei', type: 'Maternity check', status: 'Scheduled', department: 'Obstetrics & Maternity', date: '2026-08-08' },
    { id: uuid(), time: '11:15 AM', patient: 'L. Tran', clinician: 'Dr. Nasser', type: 'Cardiology', status: 'Scheduled', department: 'Cardiology', date: '2026-08-08' },
    { id: uuid(), time: '1:00 PM', patient: 'D. Petrova', clinician: 'Dr. Osei', type: 'Follow-up', status: 'Scheduled', department: 'Cardiology', date: '2026-08-08' },
    { id: uuid(), time: '2:00 PM', patient: 'J. Smith', clinician: 'Dr. Zhou', type: 'Orthopedic Consultation', status: 'Scheduled', department: 'Outpatient General', date: '2026-08-08' },
    { id: uuid(), time: '2:30 PM', patient: 'E. Clarke', clinician: 'Dr. Ibrahim', type: 'Pediatric Checkup', status: 'Scheduled', department: 'Pediatrics', date: '2026-08-08' },
  ];

  const medicalRecords = [
    { id: uuid(), patientName: 'M. Alvarez', doctorName: 'Dr. A. Osei', diagnosis: 'Essential Hypertension (ICD I10)', bp: '138/86 mmHg', pulse: 72, notes: 'Patient responding well to Amlodipine regimen. Follow up ECG in 3 months.', date: '2026-07-22' },
    { id: uuid(), patientName: 'S. Haddad', doctorName: 'Dr. H. Ibrahim', diagnosis: 'Type 2 Diabetes Mellitus (ICD E11)', bp: '124/78 mmHg', pulse: 68, notes: 'HbA1c stable at 6.8%. Diet regimen maintained.', date: '2026-06-30' },
    { id: uuid(), patientName: 'B. Okafor', doctorName: 'Dr. F. Nasser', diagnosis: 'Routine Antenatal Care - 24 Weeks (ICD Z34)', bp: '116/70 mmHg', pulse: 76, notes: 'Fetal heartbeat clear at 144 bpm. Growth parameters normal.', date: '2026-07-05' },
    { id: uuid(), patientName: 'L. Tran', doctorName: 'Dr. A. Osei', diagnosis: 'Atypical Chest Discomfort (ICD R07.9)', bp: '130/82 mmHg', pulse: 74, notes: 'Serial troponin negative. ECG sinus rhythm.', date: '2026-07-11' },
  ];

  const prescriptions = [
    { id: 'RX-9901', patientName: 'M. Alvarez', doctorName: 'Dr. A. Osei', medication: 'Amlodipine 5mg', dosage: '1 tablet daily', duration: '30 days', status: 'Active', refillsLeft: 3 },
    { id: 'RX-9902', patientName: 'M. Alvarez', doctorName: 'Dr. A. Osei', medication: 'Salbutamol 100mcg Inhaler', dosage: '2 puffs PRN for dyspnoea', duration: '60 days', status: 'Active', refillsLeft: 2 },
    { id: 'RX-9903', patientName: 'S. Haddad', doctorName: 'Dr. H. Ibrahim', medication: 'Metformin 500mg', dosage: '1 tablet twice daily with meals', duration: '90 days', status: 'Active', refillsLeft: 4 },
    { id: 'RX-9904', patientName: 'B. Okafor', doctorName: 'Dr. F. Nasser', medication: 'Elevit Prenatal Multivitamin', dosage: '1 tablet daily', duration: '90 days', status: 'Active', refillsLeft: 2 },
  ];

  const insuranceCompanies = [
    { id: 'INS-01', name: 'Medibank Private', payerCode: 'MDB-AU', phone: '132 331', supportEmail: 'claims@medibank.com.au', verificationPortal: 'https://medibank-portal.demo' },
    { id: 'INS-02', name: 'Medicare Australia', payerCode: 'MCR-GOV', phone: '132 011', supportEmail: 'provider@medicare.gov.au', verificationPortal: 'https://medicare-portal.demo' },
    { id: 'INS-03', name: 'Bupa Health Insurance', payerCode: 'BUP-AU', phone: '134 135', supportEmail: 'claims@bupa.com.au', verificationPortal: 'https://bupa-portal.demo' },
    { id: 'INS-04', name: 'HCF Insurance', payerCode: 'HCF-AU', phone: '131 372', supportEmail: 'claims@hcf.com.au', verificationPortal: 'https://hcf-portal.demo' },
    { id: 'INS-05', name: 'NIB Health', payerCode: 'NIB-AU', phone: '131 463', supportEmail: 'claims@nib.com.au', verificationPortal: 'https://nib-portal.demo' },
  ];

  const insurancePolicies = [
    { policyId: 'POL-101', patient: 'M. Alvarez', payer: 'Medibank', policyNumber: 'MB-88213', tier: 'Gold Comprehensive Extra', copay: 0.00, expiryDate: '31 Dec 2026', status: 'Verified' },
    { policyId: 'POL-102', patient: 'T. Nguyen', payer: 'Bupa', policyNumber: 'BU-40921', tier: 'Standard Hospital & Extras', copay: 25.00, expiryDate: '15 Nov 2026', status: 'Pending' },
    { policyId: 'POL-103', patient: 'S. Haddad', payer: 'Medicare', policyNumber: 'MC-11734', tier: 'Medicare Bulk-Billing', copay: 0.00, expiryDate: '30 Jun 2027', status: 'Verified' },
    { policyId: 'POL-104', patient: 'B. Okafor', payer: 'Bupa', policyNumber: 'BU-55110', tier: 'Corporate Health Care', copay: 35.00, expiryDate: '10 Aug 2026', status: 'Action needed' },
    { policyId: 'POL-105', patient: 'L. Tran', payer: 'Medicare', policyNumber: 'MC-99820', tier: 'Medicare Bulk-Billing', copay: 0.00, expiryDate: '31 Dec 2027', status: 'Verified' },
  ];

  const claims = [
    { id: 'CLM-10422', patient: 'M. Alvarez', payer: 'Medibank', amount: 182.40, status: 'Paid', date: '22 Jul 2026', procedureCode: 'CAR-01 (ECG & Consultation)' },
    { id: 'CLM-10423', patient: 'S. Haddad', payer: 'Medicare', amount: 96.00, status: 'Submitted', date: '30 Jun 2026', procedureCode: 'GP-04 (Chronic Review)' },
    { id: 'CLM-10424', patient: 'B. Okafor', payer: 'Bupa', amount: 340.00, status: 'Rejected', date: '05 Jul 2026', procedureCode: 'OBS-02 (Maternity Scan)' },
    { id: 'CLM-10425', patient: 'L. Tran', payer: 'Medicare', amount: 210.15, status: 'Submitted', date: '11 Jul 2026', procedureCode: 'CAR-02 (Cardiology Consult)' },
    { id: 'CLM-10426', patient: 'D. Petrova', payer: 'HCF', amount: 88.50, status: 'Paid', date: '18 Jul 2026', procedureCode: 'GP-01 (General Consult)' },
    { id: 'CLM-10427', patient: 'J. Smith', payer: 'Medibank', amount: 240.00, status: 'Submitted', date: '02 Aug 2026', procedureCode: 'ORT-01 (Joint Consultation)' },
  ];

  const invoices = [
    { id: 'INV-2026-001', patientName: 'M. Alvarez', date: '22 Jul 2026', items: [{ desc: 'Cardiology Specialist Consult', fee: 180.00 }, { desc: '12-Lead Electrocardiogram (ECG)', fee: 65.00 }], subtotal: 245.00, insurerReimbursement: 182.40, patientCoPay: 62.60, status: 'Paid' },
    { id: 'INV-2026-002', patientName: 'S. Haddad', date: '30 Jun 2026', items: [{ desc: 'Chronic Disease Management Plan', fee: 160.00 }], subtotal: 160.00, insurerReimbursement: 96.00, patientCoPay: 64.00, status: 'Issued' },
    { id: 'INV-2026-003', patientName: 'B. Okafor', date: '05 Jul 2026', items: [{ desc: 'Prenatal Ultrasound Imaging', fee: 340.00 }], subtotal: 340.00, insurerReimbursement: 0.00, patientCoPay: 340.00, status: 'Issued' },
    { id: 'INV-2026-004', patientName: 'L. Tran', date: '11 Jul 2026', items: [{ desc: 'Cardiology Follow-up & Troponin Pathology', fee: 210.15 }], subtotal: 210.15, insurerReimbursement: 210.15, patientCoPay: 0.00, status: 'Partially Paid' },
  ];

  const payments = [
    { id: 'PAY-8801', invoiceId: 'INV-2026-001', patientName: 'M. Alvarez', amount: 62.60, method: 'Credit Card (EFTPOS)', receiptRef: 'REC-99182', date: '22 Jul 2026' },
    { id: 'PAY-8802', invoiceId: 'INV-2026-001', patientName: 'Medibank Payout', amount: 182.40, method: 'Direct Health Fund EFT', receiptRef: 'EFT-44019', date: '24 Jul 2026' },
    { id: 'PAY-8803', invoiceId: 'INV-2026-004', patientName: 'Medicare Settlement', amount: 210.15, method: 'Medicare Direct Deposit', receiptRef: 'MCR-88120', date: '15 Jul 2026' },
  ];

  const billingStatements = [
    { statementId: 'STMT-2026-07-01', patientName: 'M. Alvarez', period: 'July 2026', totalBilled: 245.00, insurancePaid: 182.40, patientPaid: 62.60, balanceDue: 0.00, status: 'Settled' },
    { statementId: 'STMT-2026-07-02', patientName: 'S. Haddad', period: 'July 2026', totalBilled: 160.00, insurancePaid: 0.00, patientPaid: 0.00, balanceDue: 64.00, status: 'Outstanding' },
    { statementId: 'STMT-2026-07-03', patientName: 'B. Okafor', period: 'July 2026', totalBilled: 340.00, insurancePaid: 0.00, patientPaid: 0.00, balanceDue: 340.00, status: 'Overdue' },
  ];

  const messages = [
    { id: uuid(), thread: 'M. Alvarez', from: 'M. Alvarez', to: 'Dr. Osei', text: 'Hi Dr. Osei, can I get my latest blood test results?', ts: Date.now() - 3600_000 },
    { id: uuid(), thread: 'M. Alvarez', from: 'Dr. Osei', to: 'M. Alvarez', text: "Morning! Yes — everything came back within normal range. I'll add the full report to your portal today.", ts: Date.now() - 3000_000 },
    { id: uuid(), thread: 'T. Nguyen', from: 'T. Nguyen', to: 'R. Nguyen', text: 'Hello, I would like to confirm my appointment time for tomorrow morning.', ts: Date.now() - 7200_000 },
    { id: uuid(), thread: 'T. Nguyen', from: 'R. Nguyen', to: 'T. Nguyen', text: 'Hi T. Nguyen, your appointment is confirmed for 9:30 AM with Dr. Osei.', ts: Date.now() - 5400_000 },
  ];

  const dischargeSummaries = [
    {
      id: uuid(),
      patientName: 'M. Alvarez',
      clinician: 'Dr. A. Osei',
      chiefComplaint: 'Shortness of breath and mild wheezing',
      findings: 'Mild bronchial inflammation confirmed on examination; oxygen saturation 98%.',
      therapy: 'Bronchodilator nebuliser administered in clinic; rapid symptom relief observed.',
      recommendations: 'Follow up with GP in 7 days; avoid known allergens; seek immediate care if breathing deteriorates.',
      labResults: 'Full blood count within normal parameters. Inflammatory markers negative.',
      ts: Date.now() - 86400000,
    },
  ];

  const auditLog = [
    { id: uuid(), ts: Date.now() - 1800000, actor: 'r.nguyen', role: 'reception', type: 'auth', action: 'User r.nguyen successfully passed MFA step 2' },
    { id: uuid(), ts: Date.now() - 900000, actor: 'dr.osei', role: 'clinician', type: 'access', action: 'PHI viewed — Dr. A. Osei inspected patient record #4482' },
  ];

  const notifications = [
    { id: uuid(), user: 'r.nguyen', title: 'New Registration', message: 'Patient T. Nguyen registered account online.', ts: Date.now() - 3600000, read: false },
    { id: uuid(), user: 'k.patel', title: 'Claim Status Updated', message: 'Medibank claim CLM-10422 marked as Paid ($182.40).', ts: Date.now() - 7200000, read: true },
    { id: uuid(), user: 'dr.osei', title: 'Lab Result Ready', message: 'Pathology lab returned troponin results for L. Tran.', ts: Date.now() - 10800000, read: false },
  ];

  const mfaChallenges = {};

  return {
    users,
    patients,
    doctors,
    departments,
    appointments,
    medicalRecords,
    prescriptions,
    insuranceCompanies,
    insurancePolicies,
    insurance: insurancePolicies,
    claims,
    insuranceClaims: claims,
    invoices,
    payments,
    billingStatements,
    messages,
    dischargeSummaries,
    auditLog,
    notifications,
    mfaChallenges,
  };
}

module.exports = { buildSeedData, DEMO_PASSWORD };
