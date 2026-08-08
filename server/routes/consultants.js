const express = require('express');
const { v4: uuid } = require('uuid');
const { readAll, update } = require('../store');
const { requireAuth, requireRole } = require('../middleware/auth');
const { logAudit } = require('../audit');

const router = express.Router();

router.use(requireAuth);

// GET /api/consultants
router.get('/', (req, res) => {
  const data = readAll();
  res.json({ consultants: data.doctors || [] });
});

// POST /api/consultants — register new consultant (staff only)
router.post('/', requireRole('admin', 'reception', 'clinician'), async (req, res) => {
  const { name, specialization, department, fee, availableDays, bio } = req.body || {};
  if (!name || !specialization || !department) {
    return res.status(400).json({ error: 'Name, specialization, and department are required.' });
  }

  const result = await update((data) => {
    if (!data.doctors) data.doctors = [];
    const newDoctor = {
      id: uuid(),
      name: name.startsWith('Dr.') ? name.trim() : `Dr. ${name.trim()}`,
      specialization: specialization.trim(),
      department: department.trim(),
      fee: Number(fee) || 150.00,
      availableDays: availableDays || 'Mon, Tue, Wed, Thu, Fri',
      slots: ['9:00 AM', '10:00 AM', '11:00 AM', '1:30 PM', '3:00 PM'],
      bio: bio || 'Clinic Consultant Specialist.',
    };
    data.doctors.push(newDoctor);
    return newDoctor;
  });

  await logAudit({
    actor: req.user.name, role: req.user.role, type: 'access',
    action: `Registered new consultant "${result.name}" (${result.specialization}) in ${result.department}`,
  });

  res.status(201).json({ consultant: result, message: 'Consultant registered successfully.' });
});

module.exports = router;
