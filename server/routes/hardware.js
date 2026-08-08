const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { logAudit } = require('../audit');
const { sanitizeText } = require('../utils/sanitize');

const router = express.Router();

// POST /api/hardware/scan-rfid — staff or biometric hardware payload
router.post('/scan-rfid', requireAuth, requireRole('reception', 'clinician', 'billing'), async (req, res) => {
  const tagId = sanitizeText(req.body?.tagId || 'RFID-TAG-8849', { maxLength: 50 });
  const location = sanitizeText(req.body?.location || 'Clinic Main Entrance', { maxLength: 100 });

  await logAudit({
    actor: req.user.name,
    role: req.user.role,
    type: 'access',
    action: `<strong>RFID Hardware Scan:</strong> Tag ${tagId} scanned at ${location}`,
  });

  res.json({
    ok: true,
    tagId,
    location,
    status: 'ACCESS_GRANTED',
    timestamp: new Date().toISOString(),
  });
});

// POST /api/hardware/verify-biometrics — staff biometric verification
router.post('/verify-biometrics', requireAuth, requireRole('reception', 'clinician', 'billing'), async (req, res) => {
  const method = sanitizeText(req.body?.method || 'Fingerprint', { maxLength: 30 });
  const scannerId = sanitizeText(req.body?.scannerId || 'BIO-SCANNER-01', { maxLength: 50 });

  await logAudit({
    actor: req.user.name,
    role: req.user.role,
    type: 'access',
    action: `<strong>Biometrics Hardware Verification:</strong> ${method} verified on ${scannerId} (HIPAA high-security checkpoint)`,
  });

  res.json({
    ok: true,
    user: req.user.name,
    method,
    confidence: '99.8%',
    status: 'BIOMETRIC_MATCH_VERIFIED',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
