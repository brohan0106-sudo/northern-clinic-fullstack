/**
 * Declarative map of which roles own which modules.
 */
const OWNED = {
  admin: [
    'dashboard', 'users', 'roles', 'departments', 'settings', 'reports', 'consultants', 'claims', 'billing', 'payments', 'statements'
  ],
  reception: [
    'dashboard', 'add-patient', 'insurance', 'messages', 'workflow', 'consultants', 'testlog'
  ],
  clinician: [
    'dashboard', 'patients', 'medical-records', 'prescriptions', 'discharge',
    'messages', 'consultants', 'workflow', 'audit-logs', 'testlog'
  ],
  billing: [
    'dashboard', 'claims', 'statements', 'billing', 'payments', 'reports',
    'accounts', 'testlog'
  ],
  patient: [
    'dashboard', 'myappointments', 'myrecords', 'mybilling', 'mymessages', 'profile'
  ],
};

const ALL_ROLES = Object.keys(OWNED);

function ownsModule(role, moduleName) {
  return (OWNED[role] || []).includes(moduleName);
}

module.exports = { OWNED, ALL_ROLES, ownsModule };
