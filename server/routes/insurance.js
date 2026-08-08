const express = require('express');
const bcrypt = require('bcryptjs');
const { readAll, update } = require('../store');
const { requireAuth, requireRole } = require('../middleware/auth');
const { logAudit } = require('../audit');

const router = express.Router();

function maskPolicy(p) {
  if (!p || p.length <= 4) return '••••';
  return `${p.slice(0, 3)}••••${p.slice(-2)}`;
}

// GET /api/insurance — reception, clinician, billing, admin
router.get('/', requireAuth, requireRole('reception', 'clinician', 'billing', 'admin'), async (req, res) => {
  const data = readAll();
  const list = data.insurance || data.insurancePolicies || [];
  const rows = list.map(i => ({
    ...i,
    policy: maskPolicy(i.policy),
    _patient: i.patient,
  }));
  res.json({ insurance: rows, companies: data.insuranceCompanies || [] });
});

// POST /api/insurance — Register new patient insurance policy
router.post('/', requireAuth, requireRole('reception', 'billing', 'admin'), async (req, res) => {
  const { patient, payer, policy, coverage, copay, expiryDate } = req.body || {};
  if (!patient || !payer || !policy) {
    return res.status(400).json({ error: 'Patient name, payer company, and policy number are required.' });
  }

  const newPolicy = {
    patient: patient.trim(),
    payer: payer.trim(),
    policy: policy.trim(),
    coverage: coverage || 'Standard Comprehensive Extra',
    copay: copay || '$0.00',
    expiryDate: expiryDate || '31 Dec 2026',
    status: 'Pending',
    actionNote: 'Policy registered by reception staff — verification pending',
  };

  await update(data => {
    if (!data.insurance) data.insurance = [];
    data.insurance.unshift(newPolicy);
    if (!data.insurancePolicies) data.insurancePolicies = [];
    data.insurancePolicies.unshift(newPolicy);
  });

  await logAudit({
    actor: req.user.name, role: req.user.role, type: 'access',
    action: `Registered insurance policy #${policy} (${payer}) for patient ${patient}`,
  });

  res.status(201).json({ insurance: newPolicy, message: 'Patient insurance policy registered.' });
});

// POST /api/insurance/reveal { patient, password }
router.post('/reveal', requireAuth, requireRole('reception', 'clinician', 'billing', 'admin'), async (req, res) => {
  const { patient, password } = req.body || {};
  if (typeof password !== 'string' || !password) {
    return res.status(400).json({ error: 'Re-enter your password to view this insurance record.' });
  }

  const data = readAll();
  const user = data.users.find(u => u.username === req.user.username);
  const ok = user && bcrypt.compareSync(password, user.passwordHash);
  if (!ok) {
    await logAudit({ actor: req.user.name, role: req.user.role, type: 'deny', action: `Re-authentication failed while attempting to reveal policy for ${patient || 'unknown'}` });
    return res.status(401).json({ error: 'Incorrect password.' });
  }

  const list = data.insurance || data.insurancePolicies || [];
  const record = list.find(i => i.patient === patient);
  if (!record) return res.status(404).json({ error: 'Insurance record not found.' });

  await logAudit({ actor: req.user.name, role: req.user.role, type: 'access', action: `<strong>PHI viewed:</strong> full insurance policy number unmasked for ${patient}` });
  res.json({ policy: record.policy });
});

// POST /api/insurance/update-status { patient, status }
router.post('/update-status', requireAuth, requireRole('reception', 'billing', 'admin'), async (req, res) => {
  const { patient, status } = req.body || {};
  if (!patient || !status) return res.status(400).json({ error: 'Patient name and status are required.' });

  const pName = String(patient).trim().toLowerCase();
  const data = readAll();
  const list = data.insurance || data.insurancePolicies || [];
  const record = list.find(i => i.patient.trim().toLowerCase() === pName);
  if (!record) return res.status(404).json({ error: `Insurance record not found for "${patient}".` });

  await update(d => {
    const arr1 = d.insurance || [];
    const item1 = arr1.find(i => i.patient.trim().toLowerCase() === pName);
    if (item1) {
      item1.status = status;
      item1.actionNote = status === 'Verified' ? 'Coverage verified by reception staff' : `Status updated to ${status}`;
    }
    const arr2 = d.insurancePolicies || [];
    const item2 = arr2.find(i => i.patient.trim().toLowerCase() === pName);
    if (item2) {
      item2.status = status;
      item2.actionNote = status === 'Verified' ? 'Coverage verified by reception staff' : `Status updated to ${status}`;
    }
  });

  await logAudit({ actor: req.user.name, role: req.user.role, type: 'access', action: `Insurance coverage for ${record.patient} updated to ${status}` });
  res.json({ ok: true });
});

module.exports = router;
