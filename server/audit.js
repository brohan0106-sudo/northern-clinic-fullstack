const { v4: uuid } = require('uuid');
const { update } = require('./store');

/** type: 'auth' | 'access' | 'deny' | 'system' */
async function logAudit({ actor, role, type, action }) {
  const entry = { id: uuid(), ts: Date.now(), actor, role, type, action };
  await update((data) => {
    data.auditLog.push(entry);
    // Keep the persisted log from growing without bound in a long-running demo.
    if (data.auditLog.length > 500) data.auditLog = data.auditLog.slice(-500);
    return entry;
  });
  return entry;
}

module.exports = { logAudit };
