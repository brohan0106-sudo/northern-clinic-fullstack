/**
 * Declarative map of which roles own which modules.
 */
const OWNED = {
  admin: [
    'dashboard', 'users', 'roles', 'departments', 'settings', 'reports', 'consultants', 'patients', 'claims', 'billing', 'payments', 'statements', 'audit-logs'
  ],
  reception: [
    'dashboard', 'add-patient', 'patients', 'insurance', 'workflow', 'testlog', 'audit-logs'
  ],
  clinician: [
    'dashboard', 'patients', 'medical-records', 'prescriptions', 'discharge',
    'messages', 'consultants', 'workflow', 'audit-logs', 'testlog'
  ],
  billing: [
    'dashboard', 'patients', 'claims', 'statements', 'billing', 'payments', 'reports',
    'accounts', 'testlog', 'audit-logs'
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
