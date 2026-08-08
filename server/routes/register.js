const express = require('express');
const { readAll, update } = require('../store');
const { logAudit } = require('../audit');
const { validateRegistration } = require('../utils/validate');
const { sanitizeText } = require('../utils/sanitize');

const router = express.Router();

function findExisting(patients, name, dob) {
  const n = name.trim().toLowerCase();
  const d = (dob || '').trim().toLowerCase();
  return patients.find(p => p.name.toLowerCase() === n && (d === '' || p.dob.toLowerCase() === d));
}

// POST /api/register/lookup  { name, dob } — no auth: this runs before an account exists
router.post('/lookup', async (req, res) => {
  const name = sanitizeText(req.body?.name, { maxLength: 120 });
  const dob = sanitizeText(req.body?.dob, { maxLength: 40 });
  if (!name || !dob) return res.status(400).json({ error: 'Enter your full name and date of birth.' });

  const data = readAll();
  const existing = findExisting(data.patients, name, dob);
  await logAudit({ actor: name, role: 'anonymous', type: 'access', action: `Patient registration lookup — ${existing ? 'existing record found' : 'no match'}` });

  if (existing) {
    return res.json({ exists: true, maskedId: `••••${existing.id.slice(-3)}`, name: existing.name });
  }
  res.json({ exists: false });
});

// POST /api/register  { name, dob, phone, allergies }
router.post('/', async (req, res) => {
  const { valid, errors } = validateRegistration(req.body || {});
  if (!valid) return res.status(400).json({ error: 'Please complete the required fields.', fields: errors });

  const name = sanitizeText(req.body.name, { maxLength: 120 });
  const dob = sanitizeText(req.body.dob, { maxLength: 40 });
  const phone = sanitizeText(req.body.phone, { maxLength: 30 });
  const allergies = sanitizeText(req.body.allergies, { maxLength: 200 }) || 'None known';

  const data = readAll();
  // Defense in depth: re-check for a duplicate here even though the client
  // already called /lookup, since nothing stops a client calling this
  // endpoint directly and skipping that step.
  if (findExisting(data.patients, name, dob)) {
    return res.status(409).json({ error: 'A record already exists for this name and date of birth. Please sign in instead.' });
  }

  const newId = String(4700 + data.patients.length);
  const patient = { id: newId, name, dob, allergies, phone, lastVisit: 'New patient', flag: 'new' };
  await update((d) => { d.patients.push(patient); });
  await logAudit({ actor: name, role: 'anonymous', type: 'access', action: `New patient registered: ${name} (pending first appointment)` });

  res.status(201).json({ ok: true });
});

module.exports = router;
