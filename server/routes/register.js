const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
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

function deriveUsername(name) {
  const clean = name.toLowerCase().replace(/[^a-z0-9.]/g, '.').replace(/\.+/g, '.').replace(/^\.|\.$/g, '');
  return clean || `patient.${Math.floor(1000 + Math.random() * 9000)}`;
}

function deriveInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

// POST /api/register/lookup { name, dob }
router.post('/lookup', async (req, res) => {
  const name = sanitizeText(req.body?.name, { maxLength: 120 });
  const dob = sanitizeText(req.body?.dob, { maxLength: 40 });
  if (!name || !dob) return res.status(400).json({ error: 'Enter your full name and date of birth.' });

  const data = readAll();
  const existing = findExisting(data.patients, name, dob);
  await logAudit({ actor: name, role: 'anonymous', type: 'access', action: `Patient registration lookup — ${existing ? 'existing record found' : 'no match'}` });

  if (existing) {
    const user = (data.users || []).find(u => u.name.toLowerCase() === name.toLowerCase());
    return res.json({ exists: true, maskedId: `••••${existing.id.slice(-3)}`, name: existing.name, username: user ? user.username : undefined });
  }
  res.json({ exists: false });
});

// POST /api/register { name, dob, phone, allergies }
router.post('/', async (req, res) => {
  const { valid, errors } = validateRegistration(req.body || {});
  if (!valid) return res.status(400).json({ error: 'Please complete the required fields.', fields: errors });

  const name = sanitizeText(req.body.name, { maxLength: 120 });
  const dob = sanitizeText(req.body.dob, { maxLength: 40 });
  const phone = sanitizeText(req.body.phone, { maxLength: 30 });
  const allergies = sanitizeText(req.body.allergies, { maxLength: 200 }) || 'None known';

  const data = readAll();
  if (findExisting(data.patients, name, dob)) {
    return res.status(409).json({ error: 'A record already exists for this name and date of birth. Please sign in instead.' });
  }

  const newId = String(4700 + data.patients.length);
  const patient = { id: newId, name, dob, allergies, phone, lastVisit: 'New patient', flag: 'new' };
  
  const username = deriveUsername(name);
  const passwordHash = bcrypt.hashSync('Clinic#2026', 10);
  const initials = deriveInitials(name);

  await update((d) => {
    d.patients.push(patient);
    if (!d.users) d.users = [];
    const existsUser = d.users.find(u => u.username === username);
    if (!existsUser) {
      d.users.push({
        id: uuid(),
        username,
        passwordHash,
        name,
        role: 'patient',
        initials,
        failedLogins: 0,
        lockedUntil: null,
      });
    }
  });

  await logAudit({
    actor: name, role: 'anonymous', type: 'access',
    action: `New patient registered & Patient Portal account created: ${name} (Username: "${username}")`
  });

  res.status(201).json({
    ok: true,
    username,
    tempPassword: 'Clinic#2026',
    message: `Patient file created! Patient Portal login: Username "${username}", Password "Clinic#2026".`,
  });
});

module.exports = router;
