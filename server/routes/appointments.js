const express = require('express');
const { v4: uuid } = require('uuid');
const { readAll, update } = require('../store');
const { requireAuth, requireRole } = require('../middleware/auth');
const { logAudit } = require('../audit');
const { validateBooking } = require('../utils/validate');
const { sanitizeText } = require('../utils/sanitize');

const router = express.Router();

// GET /api/appointments — full schedule, staff only
router.get('/', requireAuth, requireRole('reception', 'clinician'), async (req, res) => {
  const data = readAll();
  res.json({ appointments: data.appointments });
  await logAudit({ actor: req.user.name, role: req.user.role, type: 'access', action: 'Viewed appointments' });
});

// GET /api/my/appointments — the signed-in patient's own bookings only
router.get('/mine', requireAuth, requireRole('patient'), (req, res) => {
  const data = readAll();
  const mine = data.appointments.filter(a => a.patient === req.user.name);
  res.json({ appointments: mine });
});

// POST /api/my/appointments — self-service booking with a server-side
// double-booking check (the authoritative check — the UI check is just a
// convenience that can be bypassed by calling this endpoint directly).
router.post('/mine', requireAuth, requireRole('patient'), async (req, res) => {
  const { valid, errors } = validateBooking(req.body || {});
  if (!valid) return res.status(400).json({ error: 'Please complete all fields.', fields: errors });

  const clinician = sanitizeText(req.body.clinician, { maxLength: 60 });
  const time = sanitizeText(req.body.time, { maxLength: 20 });
  const reason = sanitizeText(req.body.reason, { maxLength: 120 });

  const data = readAll();
  const conflict = data.appointments.some(a => a.clinician === clinician && a.time === time);
  if (conflict) {
    await logAudit({ actor: req.user.name, role: req.user.role, type: 'deny', action: `Booking rejected — ${clinician} / ${time} already taken (double-booking prevented)` });
    return res.status(409).json({ error: 'That slot was just taken. Please choose another time.' });
  }

  const appt = { id: uuid(), time, patient: req.user.name, clinician, type: reason, status: 'Scheduled' };
  await update((d) => { d.appointments.push(appt); });
  await logAudit({ actor: req.user.name, role: req.user.role, type: 'access', action: `Booked an appointment with ${clinician} at ${time}` });
  res.status(201).json({ appointment: appt });
});

// POST /api/appointments/checkin — reception marks a patient as arrived
router.post('/checkin', requireAuth, requireRole('reception'), async (req, res) => {
  const name = sanitizeText(req.body?.patientName, { maxLength: 120 });
  if (!name) return res.status(400).json({ error: 'Enter the patient name to check in.' });

  const data = readAll();
  const appt = data.appointments.find(a => a.patient.toLowerCase() === name.toLowerCase() && a.status !== 'Checked in');
  await update((d) => {
    const target = d.appointments.find(a => a.patient.toLowerCase() === name.toLowerCase() && a.status !== 'Checked in');
    if (target) target.status = 'Checked in';
  });
  await logAudit({ actor: req.user.name, role: req.user.role, type: 'access', action: `Checked in patient "${name}" at reception` });
  res.json({ ok: true, matched: !!appt });
});

// GET /api/appointments/availability?clinician=Dr.%20Osei
// Deliberately returns only booked time slots — not who booked them — so a
// patient can see what's free without the endpoint leaking other patients'
// names to someone who isn't clinical or reception staff.
router.get('/availability', requireAuth, requireRole('patient'), (req, res) => {
  const clinician = String(req.query.clinician || '');
  const data = readAll();
  const taken = data.appointments.filter(a => a.clinician === clinician).map(a => a.time);
  res.json({ clinician, taken });
});

module.exports = router;
