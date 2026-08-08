const express = require('express');
const { readAll } = require('../store');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth, requireRole('admin', 'billing', 'reception', 'clinician'));

// GET /api/reports/analytics
router.get('/analytics', (req, res) => {
  const data = readAll();
  const claims = data.claims || [];
  const appointments = data.appointments || [];
  const patients = data.patients || [];
  const doctors = data.doctors || [];
  const invoices = data.invoices || [];

  const totalRevenue = claims.filter(c => c.status === 'Paid').reduce((sum, c) => sum + Number(c.amount || 0), 0);
  const outstanding = claims.filter(c => c.status !== 'Paid').reduce((sum, c) => sum + Number(c.amount || 0), 0);

  const consultantRevenue = doctors.map(doc => {
    const docAppts = appointments.filter(a => a.clinician.toLowerCase().includes(doc.name.replace('Dr. ', '').toLowerCase()));
    const estRevenue = docAppts.length * (doc.fee || 150);
    return { name: doc.name, department: doc.department, apptCount: docAppts.length, estRevenue };
  });

  const patientStats = {
    total: patients.length,
    chronic: patients.filter(p => p.flag === 'chronic').length,
    maternity: patients.filter(p => p.flag === 'maternity').length,
    cardiology: patients.filter(p => p.flag === 'cardiology').length,
    new: patients.filter(p => p.flag === 'new').length,
  };

  const claimsSummary = {
    total: claims.length,
    paid: claims.filter(c => c.status === 'Paid').length,
    submitted: claims.filter(c => c.status === 'Submitted').length,
    rejected: claims.filter(c => c.status === 'Rejected').length,
  };

  res.json({
    totalRevenue,
    outstanding,
    consultantRevenue,
    patientStats,
    claimsSummary,
    appointmentCount: appointments.length,
  });
});

module.exports = router;
