const express = require('express');
const { v4: uuid } = require('uuid');
const bcrypt = require('bcryptjs');
const { readAll, update } = require('../store');
const { requireAuth, requireRole } = require('../middleware/auth');
const { logAudit } = require('../audit');

const router = express.Router();

// All routes require Admin role
router.use(requireAuth, requireRole('admin'));

// GET /api/admin/users
router.get('/users', (req, res) => {
  const data = readAll();
  const safeUsers = (data.users || []).map(u => ({
    id: u.id,
    username: u.username,
    name: u.name,
    role: u.role,
    initials: u.initials,
    failedLogins: u.failedLogins || 0,
    locked: !!(u.lockedUntil && Date.now() < u.lockedUntil),
  }));
  res.json({ users: safeUsers });
});

// POST /api/admin/users
router.post('/users', async (req, res) => {
  const { username, name, role, password } = req.body || {};
  if (!username || !name || !role || !password) {
    return res.status(400).json({ error: 'Username, name, role, and password are required.' });
  }

  const result = await update((data) => {
    if (data.users.some(u => u.username.toLowerCase() === username.trim().toLowerCase())) {
      return { error: 'Username already exists.' };
    }
    const newUser = {
      id: uuid(),
      username: username.trim(),
      passwordHash: bcrypt.hashSync(password, 10),
      name: name.trim(),
      role: role.trim(),
      initials: name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      failedLogins: 0,
      lockedUntil: null,
    };
    data.users.push(newUser);
    return { user: newUser };
  });

  if (result.error) return res.status(409).json({ error: result.error });

  await logAudit({
    actor: req.user.name, role: req.user.role, type: 'access',
    action: `Created new ${result.user.role} user account "${result.user.username}"`,
  });

  res.status(201).json({ message: 'User created successfully.', username: result.user.username });
});

// POST /api/admin/users/:id/toggle-lock
router.post('/users/:id/toggle-lock', async (req, res) => {
  const { id } = req.params;
  const result = await update((data) => {
    const user = data.users.find(u => u.id === id);
    if (!user) return { error: 'User not found.' };
    const currentlyLocked = !!(user.lockedUntil && Date.now() < user.lockedUntil);
    if (currentlyLocked) {
      user.lockedUntil = null;
      user.failedLogins = 0;
    } else {
      user.lockedUntil = Date.now() + 86400000 * 365; // Lock for 1 year
    }
    return { user, locked: !currentlyLocked };
  });

  if (result.error) return res.status(404).json({ error: result.error });

  await logAudit({
    actor: req.user.name, role: req.user.role, type: 'access',
    action: `${result.locked ? 'Locked' : 'Unlocked'} user account "${result.user.username}"`,
  });

  res.json({ message: `Account ${result.locked ? 'locked' : 'unlocked'} successfully.` });
});

// GET /api/admin/departments
router.get('/departments', (req, res) => {
  const data = readAll();
  res.json({ departments: data.departments || [] });
});

// POST /api/admin/departments
router.post('/departments', async (req, res) => {
  const { name, head, phone, floor } = req.body || {};
  if (!name || !head) return res.status(400).json({ error: 'Department name and head are required.' });

  const result = await update((data) => {
    if (!data.departments) data.departments = [];
    const newDept = { id: `dept-${Date.now()}`, name: name.trim(), head: head.trim(), phone: phone || 'Ext 100', floor: floor || 'Level 1' };
    data.departments.push(newDept);
    return newDept;
  });

  await logAudit({
    actor: req.user.name, role: req.user.role, type: 'access',
    action: `Created new department "${result.name}"`,
  });

  res.status(201).json({ department: result });
});

// GET /api/admin/settings
router.get('/settings', (req, res) => {
  const data = readAll();
  res.json({
    settings: data.systemSettings || {
      clinicName: 'Northern Medical Clinic',
      sessionTimeoutMinutes: 15,
      mfaRequired: true,
      maxFailedLogins: 5,
      maintenanceMode: false,
      auditRetentionDays: 90,
    },
  });
});

// POST /api/admin/settings
router.post('/settings', async (req, res) => {
  const { clinicName, sessionTimeoutMinutes, mfaRequired, maxFailedLogins, maintenanceMode } = req.body || {};
  const result = await update((data) => {
    data.systemSettings = {
      clinicName: clinicName || 'Northern Medical Clinic',
      sessionTimeoutMinutes: Number(sessionTimeoutMinutes) || 15,
      mfaRequired: Boolean(mfaRequired),
      maxFailedLogins: Number(maxFailedLogins) || 5,
      maintenanceMode: Boolean(maintenanceMode),
      auditRetentionDays: 90,
      updatedAt: Date.now(),
    };
    return data.systemSettings;
  });

  await logAudit({
    actor: req.user.name, role: req.user.role, type: 'access',
    action: 'Updated system security parameters and settings',
  });

  res.json({ settings: result, message: 'Settings saved successfully.' });
});

module.exports = router;
