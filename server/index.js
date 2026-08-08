const path = require('path');
const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { PORT, NODE_ENV } = require('./config');
const { DATA_FILE, initFromSeed } = require('./store');

const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const patientRoutes = require('./routes/patients');
const claimRoutes = require('./routes/claims');
const billingRoutes = require('./routes/billing');
const hardwareRoutes = require('./routes/hardware');
const insuranceRoutes = require('./routes/insurance');
const messageRoutes = require('./routes/messages');
const dischargeRoutes = require('./routes/discharge');
const registerRoutes = require('./routes/register');
const auditRoutes = require('./routes/audit');
const testRoutes = require('./routes/test');

const adminRoutes = require('./routes/admin');
const consultantRoutes = require('./routes/consultants');
const medicalRecordRoutes = require('./routes/medicalRecords');
const reportRoutes = require('./routes/reports');
const workflowRoutes = require('./routes/workflow');

// Auto-seed if data file does not exist (e.g. Vercel serverless environment)
if (!fs.existsSync(DATA_FILE)) {
  try {
    const seedFn = require('./seed');
    seedFn().catch(err => console.warn('Serverless seed note:', err.message));
  } catch (e) {
    console.warn('Data file initialization note:', e.message);
  }
}

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"],
    },
  },
}));

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '100kb' }));

app.use('/api', (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (req.headers['x-requested-with'] !== 'clinic-frontend') {
    return res.status(403).json({ error: 'Request rejected (missing anti-CSRF header).' });
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/hardware', hardwareRoutes);
app.use('/api/insurance', insuranceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/discharge-summaries', dischargeRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/test', testRoutes);
app.use('/api/tests', testRoutes);

app.use('/api/admin', adminRoutes);
app.use('/api/consultants', consultantRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/workflow', workflowRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true, env: NODE_ENV }));

app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found.' });
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on our end.' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Northern Medical Clinic running at http://localhost:${PORT}`);
  });
}

module.exports = app;
