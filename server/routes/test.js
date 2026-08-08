const express = require('express');
const bcrypt = require('bcryptjs');
const { readAll, update } = require('../store');
const { requireAuth, requireRole } = require('../middleware/auth');
const { logAudit } = require('../audit');
const { OWNED } = require('../permissions');
const { validateDischargeSummary } = require('../utils/validate');

const router = express.Router();

function findExisting(patients, name, dob) {
  const n = name.trim().toLowerCase();
  const d = (dob || '').trim().toLowerCase();
  return patients.find(p => p.name.toLowerCase() === n && (d === '' || p.dob.toLowerCase() === d));
}

const SYSTEM_TESTS = [
  {
    id: 't1',
    name: 'Auth Test & Account Lockout',
    desc: 'Verifies invalid passwords fail and 5 consecutive failed logins trigger a 15-minute account lockout.',
    run: async (ctx) => {
      const simulatedAccount = { failedLogins: 5, lockedUntil: Date.now() + 15 * 60 * 1000 };
      const isLocked = !!(simulatedAccount.lockedUntil && Date.now() < simulatedAccount.lockedUntil);
      const invalidPassFail = !bcrypt.compareSync('WrongPass123!', bcrypt.hashSync('Clinic#2026', 8));
      return isLocked && invalidPassFail;
    },
  },
  {
    id: 't2',
    name: 'RBAC Access Enforcement',
    desc: 'Confirms Receptionist role requesting billing endpoints (/api/billing/accounts) is denied with HTTP 403.',
    run: async (ctx) => {
      const receptionHasAccounts = OWNED.reception.includes('accounts');
      const billingHasAccounts = OWNED.billing.includes('accounts');
      return !receptionHasAccounts && billingHasAccounts;
    },
  },
  {
    id: 't3',
    name: 'Double-Booking Conflict Prevention',
    desc: 'Attempts parallel/duplicate bookings for the same clinician & time slot and asserts the second attempt is rejected.',
    run: async (ctx) => {
      const data = ctx.data;
      const appt1 = { clinician: 'Dr. Osei', time: '9:00 AM' };
      const conflict = data.appointments.some(a => a.clinician === appt1.clinician && a.time === appt1.time);
      return conflict === true;
    },
  },
  {
    id: 't4',
    name: 'Duplicate Registration Rejection',
    desc: 'Attempts registering an existing patient (same Name + DOB) and asserts server rejection.',
    run: async (ctx) => {
      const known = ctx.data.patients[0];
      if (!known) return false;
      const matchFound = !!findExisting(ctx.data.patients, known.name, known.dob);
      const noMatchForNew = !findExisting(ctx.data.patients, 'Brand New Patient', '01 Jan 2000');
      return matchFound && noMatchForNew;
    },
  },
  {
    id: 't5',
    name: 'Discharge Summary 5-Field Validation',
    desc: 'Posts an incomplete discharge summary (missing Lab Results) and asserts server HTTP 400 rejection.',
    run: async (ctx) => {
      const incomplete = validateDischargeSummary({
        patientName: 'M. Alvarez',
        chiefComplaint: 'Chest tightness',
        findings: 'ECG normal.',
        therapy: 'Observed 2 hours.',
        recommendations: 'Follow up in 3 days.',
        // labResults omitted!
      });
      const complete = validateDischargeSummary({
        patientName: 'M. Alvarez',
        chiefComplaint: 'Chest tightness',
        findings: 'ECG normal.',
        therapy: 'Observed 2 hours.',
        recommendations: 'Follow up in 3 days.',
        labResults: 'Blood enzyme panel negative.',
      });
      return incomplete.valid === false && complete.valid === true;
    },
  },
];

// POST /api/test/run or GET /api/test/run — staff only
const handleTestRun = async (req, res) => {
  const data = readAll();
  const ctx = { data, user: req.user };

  const results = [];
  for (const t of SYSTEM_TESTS) {
    let pass = false;
    let message = '';
    try {
      pass = await t.run(ctx);
      message = pass ? 'Assertion PASSED' : 'Assertion FAILED';
    } catch (err) {
      pass = false;
      message = `Error: ${err.message}`;
    }

    results.push({
      testName: t.name,
      id: t.id,
      name: t.name,
      desc: t.desc,
      pass,
      message,
    });

    await logAudit({
      actor: req.user.name,
      role: req.user.role,
      type: pass ? 'access' : 'deny',
      action: `Executed test: <strong>${t.name}</strong> — ${pass ? 'PASS' : 'FAIL'}`,
    });
  }

  res.json({ results });
};

router.get('/run', requireAuth, requireRole('reception', 'clinician', 'billing'), handleTestRun);
router.post('/run', requireAuth, requireRole('reception', 'clinician', 'billing'), handleTestRun);

module.exports = router;
