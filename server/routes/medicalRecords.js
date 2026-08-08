const express = require('express');
const { v4: uuid } = require('uuid');
const { readAll, update } = require('../store');
const { requireAuth, requireRole } = require('../middleware/auth');
const { logAudit } = require('../audit');

const router = express.Router();

router.use(requireAuth);

// GET /api/medical-records
router.get('/', (req, res) => {
  const data = readAll();
  let records = data.medicalRecords || [];

  if (req.user.role === 'patient') {
    records = records.filter(r => r.patientName.toLowerCase() === req.user.name.toLowerCase());
  }

  res.json({ medicalRecords: records });
});

// POST /api/medical-records — Clinicians & Admin only
router.post('/', requireRole('clinician', 'admin'), async (req, res) => {
  const { patientName, diagnosis, bp, pulse, notes } = req.body || {};
  if (!patientName || !diagnosis) {
    return res.status(400).json({ error: 'Patient name and diagnosis are required.' });
  }

  const result = await update((data) => {
    if (!data.medicalRecords) data.medicalRecords = [];
    const newRecord = {
      id: uuid(),
      patientName: patientName.trim(),
      doctorName: req.user.name,
      diagnosis: diagnosis.trim(),
      bp: bp || '120/80 mmHg',
      pulse: Number(pulse) || 72,
      notes: notes || 'Clinical assessment recorded.',
      date: new Date().toISOString().split('T')[0],
    };
    data.medicalRecords.unshift(newRecord);
    return newRecord;
  });

  await logAudit({
    actor: req.user.name, role: req.user.role, type: 'access',
    action: `Added medical record & diagnosis for patient "${result.patientName}" (${result.diagnosis})`,
  });

  res.status(201).json({ record: result, message: 'Medical record created successfully.' });
});

// GET /api/medical-records/prescriptions
router.get('/prescriptions', (req, res) => {
  const data = readAll();
  let list = data.prescriptions || [];
  if (req.user.role === 'patient') {
    list = list.filter(p => p.patientName.toLowerCase() === req.user.name.toLowerCase());
  }
  res.json({ prescriptions: list });
});

// POST /api/medical-records/prescriptions
router.post('/prescriptions', requireRole('clinician', 'admin'), async (req, res) => {
  const { patientName, medication, dosage, duration } = req.body || {};
  if (!patientName || !medication || !dosage) {
    return res.status(400).json({ error: 'Patient name, medication, and dosage are required.' });
  }

  const result = await update((data) => {
    if (!data.prescriptions) data.prescriptions = [];
    const newRx = {
      id: `RX-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: patientName.trim(),
      doctorName: req.user.name,
      medication: medication.trim(),
      dosage: dosage.trim(),
      duration: duration || '30 days',
      status: 'Active',
      refillsLeft: 3,
      issuedDate: new Date().toISOString().split('T')[0],
    };
    data.prescriptions.unshift(newRx);
    return newRx;
  });

  await logAudit({
    actor: req.user.name, role: req.user.role, type: 'access',
    action: `Issued e-Prescription "${result.medication}" (${result.dosage}) for ${result.patientName}`,
  });

  res.status(201).json({ prescription: result, message: 'e-Prescription issued successfully.' });
});

module.exports = router;
