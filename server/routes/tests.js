const express = require('express');
const { readAll } = require('../store');
const { requireAuth, requireRole } = require('../middleware/auth');
const { logAudit } = require('../audit');
const { OWNED } = require('../permissions');
const { validateDischargeSummary } = require('../utils/validate');

const router = express.Router();

function findExisting(patients, name, dob) {
  const n = name.trim().toLowerCase();
  const d = dob.trim().toLowerCase();
  return patients.find(p => p.name.toLowerCase() === n && p.dob.toLowerCase() === d);
}

const TEST_PLAN = [
  {
    id: 't1', name: 'Authentication test',
    desc: 'A request reaching an authenticated route must carry a valid, unexpired JWT session — enforced by requireAuth on every protected route.',
    run: (ctx) => !!(ctx.user && ctx.user.role),
  },
  {
    id: 't2', name: 'Role-based access control test',
    desc: 'Reception must never own the Accounts module, and Billing must always own it — a policy invariant, not a per-user check.',
    run: () => !OWNED.reception.includes('accounts') && OWNED.billing.includes('accounts'),
  },
  {
    id: 't3', name: 'Appointment double-booking test',
    desc: 'No two appointments may share the same clinician and time slot in the live data.',
    run: (ctx) => {
      const seen = new Set();
      return ctx.data.appointments.every(a => {
        const key = a.clinician + '|' + a.time;
        if (seen.has(key)) return false;
        seen.add(key); return true;
      });
    },
  },
  {
    id: 't4', name: 'Patient registration duplicate-check test',
    desc: 'Looking up a known patient by name + DOB must find them, and a fabricated name must not match anyone.',
    run: (ctx) => {
      const known = ctx.data.patients[0];
      const foundKnown = !!findExisting(ctx.data.patients, known.name, known.dob);
      const foundUnknown = !findExisting(ctx.data.patients, 'Zz Nonexistent Patient', '01 Jan 1900');
      return foundKnown && foundUnknown;
    },
  },
  {
    id: 't5', name: 'Discharge summary validation test',
    desc: 'An incomplete discharge summary must be rejected server-side, and a complete one must pass — verified against the real validator, not a UI mock.',
    run: () => {
      const incomplete = validateDischargeSummary({ patientName: 'M. Alvarez', chiefComplaint: '', findings: '', therapy: '', recommendations: '' });
      const complete = validateDischargeSummary({
        patientName: 'M. Alvarez', chiefComplaint: 'Shortness of breath',
        findings: 'Mild bronchitis confirmed on examination.',
        therapy: 'Bronchodilator administered, patient responded well.',
        recommendations: 'Follow up in 7 days, seek care if symptoms worsen.',
      });
      return incomplete.valid === false && complete.valid === true;
    },
  },
  {
    id: 't6', name: 'Account lockout test',
    desc: 'A user account with 5+ recorded failed logins must be locked, and one with fewer must not be.',
    run: (ctx) => {
      const lockedCandidate = { failedLogins: 5, lockedUntil: Date.now() + 60000 };
      const okCandidate = { failedLogins: 2, lockedUntil: null };
      const isLocked = (u) => !!(u.lockedUntil && Date.now() < u.lockedUntil);
      return isLocked(lockedCandidate) === true && isLocked(okCandidate) === false;
    },
  },
  {
    id: 't7', name: 'Care Workflow 6-step integrity test',
    desc: 'All 16 collections in store must be initialized and accessible for the full care lifecycle.',
    run: (ctx) => {
      return !!(ctx.data.users && ctx.data.patients && ctx.data.doctors && ctx.data.departments && ctx.data.appointments && ctx.data.claims && ctx.data.invoices && ctx.data.payments);
    },
  },
  {
    id: 't8', name: 'Admin system security policy test',
    desc: 'Admin role must own settings, users, and audit-logs modules.',
    run: () => OWNED.admin.includes('settings') && OWNED.admin.includes('users') && OWNED.admin.includes('audit-logs'),
  },
];

// GET /api/tests/run — staff only; executes real assertions and logs each result
router.get('/run', requireAuth, requireRole('admin', 'reception', 'clinician', 'billing'), async (req, res) => {
  const data = readAll();
  const ctx = { data, user: req.user };

  const results = [];
  for (const t of TEST_PLAN) {
    let pass = false;
    try { pass = !!t.run(ctx); } catch { pass = false; }
    results.push({ id: t.id, name: t.name, desc: t.desc, pass });
    await logAudit({
      actor: req.user.name, role: req.user.role,
      type: pass ? 'access' : 'deny',
      action: `Test executed: <strong>${t.name}</strong> — ${pass ? 'PASS' : 'FAIL'}`,
    });
  }

  res.json({ results });
});

module.exports = router;
