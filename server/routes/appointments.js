const express = require('express');
const { v4: uuid } = require('uuid');
const { readAll, update } = require('../store');
const { requireAuth, requireRole } = require('../middleware/auth');
const { logAudit } = require('../audit');
const { validateBooking } = require('../utils/validate');
const { sanitizeText } = require('../utils/sanitize');

const router = express.Router();

// GET /api/appointments — full schedule, staff only
router.get('/', requireAuth, async (req, res) => {
  const data = readAll();
  if (req.user.role === 'patient') {
    const mine = (data.appointments || []).filter(a => a.patient.toLowerCase() === req.user.name.toLowerCase());
    return res.json({ appointments: mine });
  }
  res.json({ appointments: data.appointments || [] });
  await logAudit({ actor: req.user.name, role: req.user.role, type: 'access', action: 'Viewed appointments' });
});

// GET /api/appointments/mine — the signed-in patient's own bookings
router.get('/mine', requireAuth, requireRole('patient'), (req, res) => {
  const data = readAll();
  const mine = (data.appointments || []).filter(a => a.patient.toLowerCase() === req.user.name.toLowerCase());
  res.json({ appointments: mine });
});

// Shared booking handler function
async function handleBooking(req, res) {
  const { valid, errors } = validateBooking(req.body || {});
  if (!valid) return res.status(400).json({ error: 'Please complete all fields.', fields: errors });

  const clinician = sanitizeText(req.body.clinician, { maxLength: 60 });
  const time = sanitizeText(req.body.time, { maxLength: 20 });
  const reason = sanitizeText(req.body.reason, { maxLength: 120 });
  const patientName = req.user.role === 'patient' ? req.user.name : (sanitizeText(req.body.patient, { maxLength: 120 }) || req.user.name);

  const data = readAll();
  const conflict = (data.appointments || []).some(a => a.clinician === clinician && a.time === time);
  if (conflict) {
    await logAudit({ actor: req.user.name, role: req.user.role, type: 'deny', action: `Booking rejected — ${clinician} / ${time} already taken (double-booking prevented)` });
    return res.status(409).json({ error: 'That slot is already booked. Please choose another time or clinician.' });
  }

  const appt = { id: uuid(), time, patient: patientName, clinician, type: reason, status: 'Scheduled', date: new Date().toISOString().split('T')[0] };
  await update((d) => {
    if (!d.appointments) d.appointments = [];
    d.appointments.push(appt);
  });
  await logAudit({ actor: req.user.name, role: req.user.role, type: 'access', action: `Booked appointment for ${patientName} with ${clinician} at ${time}` });
  res.status(201).json({ appointment: appt, message: 'Appointment booked successfully.' });
}

// POST /api/appointments and POST /api/appointments/mine
router.post('/', requireAuth, handleBooking);
router.post('/mine', requireAuth, handleBooking);

// POST /api/appointments/checkin — reception marks a patient as arrived
router.post('/checkin', requireAuth, requireRole('reception'), async (req, res) => {
  const name = sanitizeText(req.body?.patientName, { maxLength: 120 });
  if (!name) return res.status(400).json({ error: 'Enter the patient name to check in.' });

  const data = readAll();
  const appt = (data.appointments || []).find(a => a.patient.toLowerCase() === name.toLowerCase() && a.status !== 'Checked in');
  await update((d) => {
    const target = (d.appointments || []).find(a => a.patient.toLowerCase() === name.toLowerCase() && a.status !== 'Checked in');
    if (target) target.status = 'Checked in';
  });
  await logAudit({ actor: req.user.name, role: req.user.role, type: 'access', action: `Checked in patient "${name}" at reception` });
  res.json({ ok: true, matched: !!appt });
});

// GET /api/appointments/availability?clinician=Dr.%20Osei
router.get('/availability', requireAuth, (req, res) => {
  const clinician = String(req.query.clinician || '');
  const data = readAll();
  const taken = (data.appointments || []).filter(a => a.clinician === clinician).map(a => a.time);
  res.json({ clinician, taken });
});

module.exports = router;
