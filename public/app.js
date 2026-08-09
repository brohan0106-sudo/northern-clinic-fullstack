/* ============================================================
   Northern Medical Clinic — frontend application
   ============================================================ */

const ICONS = {
  dashboard: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.7"/><rect x="13" y="3" width="8" height="5" rx="1.5" stroke="currentColor" stroke-width="1.7"/><rect x="13" y="12" width="8" height="9" rx="1.5" stroke="currentColor" stroke-width="1.7"/><rect x="3" y="15" width="8" height="6" rx="1.5" stroke="currentColor" stroke-width="1.7"/></svg>',
  calendar: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  checkin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="m5 13 4 4 10-10" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  patients: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3.3" stroke="currentColor" stroke-width="1.7"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="17.5" cy="9" r="2.4" stroke="currentColor" stroke-width="1.5"/><path d="M15 20c.2-2.5 1.9-4.5 4.2-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  discharge: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 3h9a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M13 12H3m0 0 3.5-3.5M3 12l3.5 3.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  messages: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 5h16v11H8l-4 4V5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
  claims: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  accounts: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 10h18M6 10V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4M4 10v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  reports: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 20V10M12 20V4M20 20v-7" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
  insurance: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3 5 6v6c0 4.4 3 7.7 7 9 4-1.3 7-4.6 7-9V6l-7-3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="m9.5 12 2 2 3.5-3.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  consultants: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.7"/><path d="M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" stroke="currentColor" stroke-width="1.7"/></svg>',
  workflow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  settings: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.7"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" stroke="currentColor" stroke-width="1.7"/></svg>',
  users: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.7"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.7"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" stroke-width="1.7"/><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="1.7"/></svg>',
};

// Navigation per Role
const NAV = {
  admin: [
    { section: 'Administration' },
    { id: 'dashboard', label: 'Dashboard Overview', icon: 'dashboard' },
    { id: 'users', label: 'Users & Roles (RBAC)', icon: 'users' },
    { id: 'patients', label: 'Patient Roster & Search', icon: 'patients' },
    { id: 'departments', label: 'Departments', icon: 'accounts' },
    { id: 'consultants', label: 'Consultants Directory', icon: 'consultants' },
    { id: 'reports', label: 'Financial & Clinical Reports', icon: 'reports' },
    { id: 'settings', label: 'System Settings', icon: 'settings' },
    { id: 'audit-logs', label: 'Security Audit Logs', icon: 'claims' },
  ],
  reception: [
    { section: 'Front Desk Operations' },
    { id: 'dashboard', label: 'Dashboard & Check-In Roster', icon: 'dashboard' },
    { id: 'add-patient', label: 'Register Patient', icon: 'patients' },
    { id: 'patients', label: 'Patient Roster & Search', icon: 'patients' },
    { id: 'insurance', label: 'Insurance Verification', icon: 'insurance' },
    { id: 'workflow', label: 'Care Workflow Stepper', icon: 'workflow' },
    { id: 'audit-logs', label: 'Security Audit Logs', icon: 'claims' },
  ],
  clinician: [
    { section: 'Clinical Operations' },
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'patients', label: 'Patient Roster', icon: 'patients' },
    { id: 'medical-records', label: 'Medical Records', icon: 'patients' },
    { id: 'prescriptions', label: 'Prescriptions (Rx)', icon: 'claims' },
    { id: 'discharge', label: 'Discharge Summary', icon: 'discharge' },
    { id: 'consultants', label: 'Consultants Directory', icon: 'consultants' },
    { id: 'workflow', label: 'Care Workflow Stepper', icon: 'workflow' },
    { id: 'messages', label: 'Secure Messaging', icon: 'messages' },
    { id: 'audit-logs', label: 'Security Audit Logs', icon: 'claims' },
  ],
  billing: [
    { section: 'Financial Operations' },
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'claims', label: 'Claims & Insurance', icon: 'claims' },
    { id: 'billing', label: 'Invoice Generation', icon: 'accounts' },
    { id: 'payments', label: 'Payment Tracking', icon: 'checkin' },
    { id: 'statements', label: 'Billing Statements', icon: 'accounts' },
    { id: 'reports', label: 'Financial Reports', icon: 'reports' },
    { id: 'audit-logs', label: 'Security Audit Logs', icon: 'claims' },
  ],
  patient: [
    { section: 'Patient Care Portal' },
    { id: 'dashboard', label: 'Dashboard Overview', icon: 'dashboard' },
    { id: 'myappointments', label: 'My Appointments', icon: 'calendar' },
    { id: 'myrecords', label: 'My Medical Records', icon: 'patients' },
    { id: 'mybilling', label: 'My Claims & Billing', icon: 'claims' },
    { id: 'mymessages', label: 'Messaging', icon: 'messages' },
    { id: 'profile', label: 'My Profile', icon: 'users' },
  ],
};

const MODULE_TITLE = {
  dashboard: 'Dashboard Overview', 'add-patient': 'Register New Patient', insurance: 'Insurance & Policy Management',
  patients: 'Patient Roster & History', 'medical-records': 'Medical Records & Clinical Notes', prescriptions: 'e-Prescriptions (Rx)',
  discharge: 'Discharge Summary', consultants: 'Consultants Directory & Schedules', departments: 'Clinic Departments',
  claims: 'Insurance Claims Pipeline', statements: 'Billing Statements', billing: 'Invoice Generation & Charges', payments: 'Payments & Receipts',
  reports: 'Financial & Clinical Reports', messages: 'Secure Messaging', 'audit-logs': 'Security Audit Logs',
  workflow: 'Care Workflow Stepper', users: 'Users & Roles (RBAC)', settings: 'System Settings', profile: 'My Profile',
  myappointments: 'My Appointments', myrecords: 'My Medical Records', mybilling: 'My Claims & Billing', mymessages: 'Messaging',
};

const PRESETS = {
  bronchitis: {
    complaint: 'Acute productive cough, dyspnoea for 3 days',
    findings: 'Bilateral rhonchi on auscultation. Temperature 37.8°C. No consolidation on X-ray.',
    therapy: 'Salbutamol inhaler PRN, Amoxicillin 500mg TDS for 7 days.',
    recommendations: 'Rest, increase fluid intake, follow up in 5 days or if fever persists.',
    labResults: 'Sputum culture negative. Blood WBC 11.2 (mild elevation).',
  },
  chestpain: {
    complaint: 'Substernal chest tightness following exertion',
    findings: 'Vitals stable. BP 130/82. Heart sounds S1/S2 dual. Serial troponin negative.',
    therapy: 'Aspirin 300mg stat, Sublingual GTN administered with full relief.',
    recommendations: 'Outpatient exercise stress test, cardiology follow-up in 1 week.',
    labResults: 'Troponin I <0.01 ng/mL x2, ECG 12-lead sinus rhythm, no ST changes.',
  },
  hypertension: {
    complaint: 'Routine chronic disease monitoring for essential hypertension',
    findings: 'BP 138/86 mmHg. Fundoscopy normal. No peripheral oedema.',
    therapy: 'Continued Amlodipine 5mg daily. Low-sodium diet advised.',
    recommendations: 'Home BP log for 2 weeks, routine pathology in 6 months.',
    labResults: 'eGFR >90 mL/min, Serum Creatinine 78 umol/L, Electrolytes normal.',
  },
};

/* ---------- State ---------- */
const state = {
  user: null,
  route: 'dashboard',
  tempToken: null,
  auditPoll: null,
  sessionHandle: null,
  sessionSeconds: 15 * 60,
  auditFilter: 'all',
  auditPage: 1,
  auditItemsPerPage: 8,
  auditEntries: [],
};

/* ---------- Helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

async function api(path, { method = 'GET', body } = {}) {
  const opts = {
    method,
    credentials: 'include',
    headers: {},
  };
  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  if (method !== 'GET') {
    opts.headers['X-Requested-With'] = 'clinic-frontend';
  }
  const res = await fetch(path, opts);
  let data = null;
  try { data = await res.json(); } catch { /* no body */ }
  if (!res.ok) {
    if (res.status === 401 && !path.includes('/auth/login') && !path.includes('/auth/verify-mfa')) {
      showLoginScreen();
    }
    const err = new Error((data && data.error) || `Request failed (${res.status})`);
    err.status = res.status;
    err.fields = data && data.fields;
    throw err;
  }
  return data;
}

function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toast._h);
  toast._h = setTimeout(() => { t.hidden = true; }, 3200);
}

function escapeHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
function money(n) { return `$${Number(n || 0).toFixed(2)}`; }

function statusChip(status) {
  const map = {
    'Checked in': 'chip-success', 'Waiting': 'chip-warn', 'Scheduled': 'chip-neutral',
    'Verified': 'chip-success', 'Pending': 'chip-warn', 'Action needed': 'chip-danger',
    'Paid': 'chip-success', 'Submitted': 'chip-teal', 'Rejected': 'chip-danger',
    'Active': 'chip-success', 'Issued': 'chip-warn', 'Settled': 'chip-success',
  };
  return `<span class="chip ${map[status] || 'chip-neutral'}">${status}</span>`;
}

function pageHead(eyebrow, title, sub) {
  return `<div class="page-head">
    <div>
      <div class="page-eyebrow">${escapeHtml(eyebrow)}</div>
      <h1 class="page-title">${escapeHtml(title)}</h1>
      <div class="page-sub">${escapeHtml(sub)}</div>
    </div>
  </div>`;
}

/* ---------- Login Flow ---------- */
function initLogin() {
  $$('.demo-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      $('#username').value = chip.dataset.user;
      $('#password').value = 'Clinic#2026';
      $('#loginError').hidden = true;
    });
  });

  $('#btnContinue').addEventListener('click', async () => {
    const username = $('#username').value.trim();
    const password = $('#password').value.trim();
    const errEl = $('#loginError');
    errEl.hidden = true;

    if (!username || !password) {
      errEl.textContent = 'Please enter both username and password.';
      errEl.hidden = false; return;
    }

    try {
      const data = await api('/api/auth/login', { method: 'POST', body: { username, password } });
      state.tempToken = data.tempToken;
      $('#mfaUserLabel').textContent = data.userLabel || username;
      $('#mfaDemoCode').textContent = data.demoCode || '123456';
      showStep('mfa');
    } catch (e) {
      errEl.textContent = e.message;
      errEl.hidden = false;
    }
  });

  $('#btnVerify').addEventListener('click', async () => {
    const code = $('#mfaInput').value.trim();
    const errEl = $('#mfaError');
    errEl.hidden = true;

    if (!code) {
      errEl.textContent = 'Enter the 6-digit verification code.';
      errEl.hidden = false; return;
    }

    try {
      const data = await api('/api/auth/verify-mfa', { method: 'POST', body: { tempToken: state.tempToken, code } });
      state.user = data.user;
      enterApp();
    } catch (e) {
      errEl.textContent = e.message;
      errEl.hidden = false;
    }
  });

  $('#btnBack').addEventListener('click', () => showStep('credentials'));
  $('#btnShowRegister').addEventListener('click', () => showStep('register'));
  $('#btnRegisterBack').addEventListener('click', () => showStep('credentials'));

  $('#btnRegisterCheck').addEventListener('click', async () => {
    const name = $('#regName').value.trim();
    const dob = $('#regDob').value.trim();
    const resBox = $('#regLookupResult');

    if (!name || !dob) {
      resBox.innerHTML = '<div class="notice notice-danger">Enter full name and date of birth.</div>';
      return;
    }

    try {
      const data = await api('/api/register/lookup', { method: 'POST', body: { name, dob } });
      if (data.exists) {
        resBox.innerHTML = `<div class="notice notice-danger">A record matching these details already exists (#${escapeHtml(data.maskedId)}). Please sign in with your credentials.</div>`;
        $('#regDetailsFields').hidden = true;
      } else {
        resBox.innerHTML = '<div class="notice notice-info">No existing record found — please complete registration below.</div>';
        $('#regDetailsFields').hidden = false;
        $('#btnRegisterCheck').textContent = 'Complete registration';
        $('#btnRegisterCheck').onclick = doCompleteRegister;
      }
    } catch (e) {
      resBox.innerHTML = `<div class="notice notice-danger">${escapeHtml(e.message)}</div>`;
    }
  });
}

async function doCompleteRegister() {
  const body = {
    name: $('#regName').value.trim(),
    dob: $('#regDob').value.trim(),
    phone: $('#regPhone').value.trim(),
    allergies: $('#regAllergies').value.trim(),
  };
  try {
    await api('/api/register', { method: 'POST', body });
    toast('Registration complete! Please sign in with your patient credentials.');
    showStep('credentials');
  } catch (e) {
    $('#regLookupResult').innerHTML = `<div class="notice notice-danger">${escapeHtml(e.message)}</div>`;
  }
}

function showStep(step) {
  $$('.login-step').forEach(s => s.hidden = s.dataset.step !== step);
}

/* ---------- App shell ---------- */
function showLoginScreen() {
  state.user = null;
  clearInterval(state.auditPoll);
  clearInterval(state.sessionHandle);
  $('#app').hidden = true;
  const login = $('#loginScreen');
  if (login) login.style.display = 'grid';
  showStep('credentials');
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname);
  }
}

function enterApp() {
  const login = $('#loginScreen');
  if (login) login.style.display = 'none';
  $('#app').hidden = false;

  $('#userAvatar').textContent = state.user.initials;
  $('#userName').textContent = state.user.name;
  $('#userRoleLabel').textContent = capitalize(state.user.role);

  const hasAuditPermission = ['admin', 'reception', 'clinician', 'billing'].includes(state.user.role);
  if ($('#btnAudit')) $('#btnAudit').style.display = hasAuditPermission ? 'flex' : 'none';

  buildSidebar();
  window.removeEventListener('hashchange', render);
  window.addEventListener('hashchange', render);
  if (!window.location.hash || window.location.hash === '#/') {
    window.location.hash = '#/dashboard';
  } else {
    render();
  }

  startSessionCountdown();

  $('#btnLogout').onclick = () => doLogout('Signed out.');
  if ($('#btnAudit') && hasAuditPermission) $('#btnAudit').onclick = () => toggleAuditDrawer();
  if ($('#btnCloseAudit')) $('#btnCloseAudit').onclick = () => $('#auditDrawer').classList.add('closed');

  if (hasAuditPermission) {
    refreshAudit();
    state.auditPoll = setInterval(refreshAudit, 4000);
  }
}

function toggleAuditDrawer() {
  if (!['admin', 'reception', 'clinician', 'billing'].includes(state.user?.role)) return;
  $('#auditDrawer').classList.toggle('closed');
}

async function doLogout(message) {
  try { await api('/api/auth/logout', { method: 'POST' }); } catch { /* ignore */ }
  if (message) toast(message);
  showLoginScreen();
}

function startSessionCountdown() {
  state.sessionSeconds = 15 * 60;
  clearInterval(state.sessionHandle);
  state.sessionHandle = setInterval(() => {
    state.sessionSeconds -= 1;
    const m = Math.floor(state.sessionSeconds / 60), s = state.sessionSeconds % 60;
    const timerEl = $('#sessionTimer');
    const pillEl = $('#sessionPill');
    if (timerEl) timerEl.textContent = `${m}:${String(s).padStart(2, '0')}`;
    if (pillEl) pillEl.classList.toggle('warn', state.sessionSeconds <= 60);
    if (state.sessionSeconds <= 0) doLogout('Session expired for security. Please sign in again.');
  }, 1000);
}

/* ---------- Audit drawer ---------- */
async function refreshAudit() {
  if (!['admin', 'reception', 'clinician', 'billing'].includes(state.user?.role)) return;
  try {
    const data = await api('/api/audit');
    state.auditEntries = data.entries || [];
    renderAuditDrawer();
    if (state.route === 'audit-logs') {
      const tbody = $('#auditLogTableBody');
      if (tbody) {
        tbody.innerHTML = state.auditEntries.map(e => `<tr>
          <td>${fmtTime(e.ts)}</td>
          <td><strong>${escapeHtml(e.actor)}</strong></td>
          <td><span class="chip chip-teal">${escapeHtml(e.role)}</span></td>
          <td><span class="chip ${e.type === 'deny' ? 'chip-danger' : 'chip-neutral'}">${escapeHtml(e.type)}</span></td>
          <td>${e.action}</td>
        </tr>`).join('');
      }
    }
  } catch { /* session may have expired */ }
}

function renderAuditDrawer() {
  const log = $('#auditLog');
  if (!log) return;

  let filtered = state.auditEntries;
  if (state.auditFilter === 'auth') filtered = filtered.filter(e => e.type === 'auth');
  else if (state.auditFilter === 'access') filtered = filtered.filter(e => e.type === 'access');
  else if (state.auditFilter === 'deny') filtered = filtered.filter(e => e.type === 'deny');
  else if (state.auditFilter === 'phi') filtered = filtered.filter(e => (e.action || '').includes('PHI viewed') || (e.action || '').includes('unmasked'));

  const totalPages = Math.max(1, Math.ceil(filtered.length / state.auditItemsPerPage));
  state.auditPage = Math.min(state.auditPage, totalPages);
  const start = (state.auditPage - 1) * state.auditItemsPerPage;
  const pageEntries = filtered.slice(start, start + state.auditItemsPerPage);

  log.innerHTML = pageEntries.map(e => `
    <li class="audit-entry${e.type === 'deny' ? ' deny' : e.type === 'auth' ? ' auth' : ''}">
      <span class="t">${fmtTime(e.ts)} · ${escapeHtml(e.actor)} (${escapeHtml(e.role)})</span>
      ${e.action}
    </li>`).join('') || '<li class="audit-entry"><span class="t">No matching log entries</span></li>';

  const controls = $('#auditControls');
  if (controls) {
    controls.innerHTML = `
      <div class="audit-filters" style="display:flex; flex-wrap:wrap; gap:4px; margin-bottom:8px;">
        <button class="btn btn-small ${state.auditFilter === 'all' ? 'btn-primary' : 'btn-ghost'}" data-audit-filter="all">All (${state.auditEntries.length})</button>
        <button class="btn btn-small ${state.auditFilter === 'auth' ? 'btn-primary' : 'btn-ghost'}" data-audit-filter="auth">Auth</button>
        <button class="btn btn-small ${state.auditFilter === 'access' ? 'btn-primary' : 'btn-ghost'}" data-audit-filter="access">Access</button>
        <button class="btn btn-small ${state.auditFilter === 'deny' ? 'btn-primary' : 'btn-ghost'}" data-audit-filter="deny">Denials</button>
        <button class="btn btn-small ${state.auditFilter === 'phi' ? 'btn-primary' : 'btn-ghost'}" data-audit-filter="phi">PHI</button>
      </div>
      <div class="audit-pagination" style="display:flex; justify-content:space-between; align-items:center; font-size:11.5px; color:var(--teal-300); margin-bottom:8px;">
        <span>Page ${state.auditPage} of ${totalPages} (${filtered.length} logs)</span>
        <div style="display:flex; gap:4px;">
          <button class="btn btn-small btn-ghost" id="btnAuditPrev" ${state.auditPage <= 1 ? 'disabled' : ''}>Prev</button>
          <button class="btn btn-small btn-ghost" id="btnAuditNext" ${state.auditPage >= totalPages ? 'disabled' : ''}>Next</button>
        </div>
      </div>`;

    $$('[data-audit-filter]', controls).forEach(b => {
      b.addEventListener('click', () => {
        state.auditFilter = b.dataset.auditFilter;
        state.auditPage = 1;
        renderAuditDrawer();
      });
    });
    $('#btnAuditPrev')?.addEventListener('click', () => { if (state.auditPage > 1) { state.auditPage--; renderAuditDrawer(); } });
    $('#btnAuditNext')?.addEventListener('click', () => { if (state.auditPage < totalPages) { state.auditPage++; renderAuditDrawer(); } });
  }
}

/* ---------- Sidebar / Routing ---------- */
function buildSidebar() {
  const nav = NAV[state.user.role] || NAV.patient;
  const el = $('#sidebar');

  el.innerHTML = nav.map(item => {
    if (item.section) return `<div class="side-section">${item.section}</div>`;
    const iconSvg = ICONS[item.icon] || '';
    return `<button class="side-link" data-route="${item.id}">
      ${iconSvg} <span>${item.label}</span>
    </button>`;
  }).join('');

  $$('.side-link', el).forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.hash = `#/${btn.dataset.route}`;
    });
  });
}

function updateSidebarActive(route) {
  $$('.side-link').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.route === route);
  });
}

async function render() {
  if (!state.user) {
    showLoginScreen();
    return;
  }
  const hash = window.location.hash || '#/dashboard';
  const route = hash.replace(/^#\//, '') || 'dashboard';
  state.route = route;

  updateSidebarActive(route);
  if ($('#topbarModule')) $('#topbarModule').textContent = MODULE_TITLE[route] || capitalize(route);

  const main = $('#content');
  if (!main) return;
  const renderer = ROUTE_RENDERERS[route] || renderDashboard;

  try {
    main.innerHTML = await renderer();
    wireModule(route);
  } catch (e) {
    if (e.status === 401 || (e.message && e.message.includes('Not signed in'))) {
      showLoginScreen();
      return;
    }
    main.innerHTML = `<div class="notice notice-danger">${escapeHtml(e.message)}</div>`;
  }
}

/* ---------- Tables ---------- */
function appointmentsTable(rows) {
  let displayRows = rows || [];
  if (state.user?.role === 'reception') {
    displayRows = displayRows.filter(a => a.status !== 'Checked in' && a.status !== 'Completed');
  }
  if (!displayRows.length) return '<div class="empty-state">No pending arrivals in reception waiting queue.</div>';
  const canAct = state.user?.role === 'reception';
  return `<table><thead><tr><th>Time</th><th>Patient</th><th>Clinician</th><th>Department</th><th>Type</th><th>Status</th>${canAct ? '<th>Action</th>' : ''}</tr></thead><tbody>
    ${displayRows.map(a => {
      const actionBtn = canAct 
        ? `<button class="btn btn-small btn-primary btn-checkin-action" data-checkin-name="${escapeHtml(a.patient)}">Check In</button>`
        : '';
      return `<tr>
        <td><strong>${a.time}</strong></td>
        <td>${escapeHtml(a.patient)}</td>
        <td>${escapeHtml(a.clinician)}</td>
        <td>${escapeHtml(a.department || 'Outpatient General')}</td>
        <td>${escapeHtml(a.type)}</td>
        <td>${statusChip(a.status)}</td>
        ${canAct ? `<td>${actionBtn}</td>` : ''}
      </tr>`;
    }).join('')}
  </tbody></table>`;
}

function claimsTable(rows) {
  if (!rows || !rows.length) return '<div class="empty-state">No billing activity yet.</div>';
  return `<table><thead><tr><th>Claim ID</th><th>Patient</th><th>Payer</th><th>Amount</th><th>Status</th></tr></thead><tbody>
    ${rows.map(c => `<tr><td class="mask">${escapeHtml(c.id)}</td><td>${escapeHtml(c.patient)}</td><td>${escapeHtml(c.payer)}</td><td>${money(c.amount)}</td><td>${statusChip(c.status)}</td></tr>`).join('')}
  </tbody></table>`;
}

function patientsTable(rows) {
  return `<table><thead><tr><th>MRN</th><th>Patient Name</th><th>DOB</th><th>Phone</th><th>Allergies</th><th>Flag / Speciality</th></tr></thead><tbody>
    ${rows.map(p => `<tr>
      <td class="mask" data-role="mrn">${p.id} <button class="mask-toggle" data-reveal="${p.id}">Show</button></td>
      <td><strong>${escapeHtml(p.name)}</strong></td>
      <td>${escapeHtml(p.dob)}</td>
      <td>${escapeHtml(p.phone || '04xx xxx xxx')}</td>
      <td>${escapeHtml(p.allergies)}</td>
      <td><span class="chip chip-teal">${escapeHtml(p.flag || 'General')}</span></td>
    </tr>`).join('')}
  </tbody></table>`;
}

/* ---------- 1. Dashboard View ---------- */
async function renderDashboard() {
  const role = state.user.role;

  if (role === 'admin') {
    const analytics = await api('/api/reports/analytics');
    const { users } = await api('/api/admin/users');
    return pageHead('Administration', `System Overview — ${state.user.name}`, 'Live platform status, active users, and operating metrics.') + `
    <div class="grid grid-4" style="margin-bottom:18px;">
      <div class="card stat-card"><div class="stat-label">Total System Users</div><div class="stat-value">${users.length}</div></div>
      <div class="card stat-card"><div class="stat-label">Total Patient Files</div><div class="stat-value">${analytics.patientStats.total}</div></div>
      <div class="card stat-card"><div class="stat-label">Total Revenue Collected</div><div class="stat-value" style="color:var(--success);">${money(analytics.totalRevenue)}</div></div>
      <div class="card stat-card"><div class="stat-label">Accounts Receivable</div><div class="stat-value" style="color:var(--danger);">${money(analytics.outstanding)}</div></div>
    </div>
    <div class="grid grid-2">
      <div class="card"><div class="card-head"><h3>Active System Accounts</h3></div>
        <table><thead><tr><th>Username</th><th>Name</th><th>Role</th><th>Status</th></tr></thead><tbody>
          ${users.slice(0, 5).map(u => `<tr><td>${u.username}</td><td>${u.name}</td><td><span class="chip chip-teal">${u.role}</span></td><td>${u.locked ? '<span class="chip chip-danger">Locked</span>' : '<span class="chip chip-success">Active</span>'}</td></tr>`).join('')}
        </tbody></table>
      </div>
      <div class="card"><div class="card-head"><h3>Consultant Revenue Estimates</h3></div>
        <table><thead><tr><th>Consultant</th><th>Department</th><th>Appts</th><th>Est. Revenue</th></tr></thead><tbody>
          ${analytics.consultantRevenue.map(c => `<tr><td>${c.name}</td><td>${c.department}</td><td>${c.apptCount}</td><td>${money(c.estRevenue)}</td></tr>`).join('')}
        </tbody></table>
      </div>
    </div>`;
  }

  if (role === 'reception') {
    const [{ appointments }, { insurance }] = await Promise.all([
      api('/api/appointments'), api('/api/insurance')
    ]);
    const pendingArrivals = (appointments || []).filter(a => a.status !== 'Checked in' && a.status !== 'Completed');
    const checkedInToday = (appointments || []).filter(a => a.status === 'Checked in').length;
    const pendingInsurance = (insurance || []).filter(p => p.status === 'Pending').length;

    return pageHead('Reception', `Reception Dashboard & Waiting Roster`, "Front-desk arrival check-in queue and pending health fund verifications.") + `
    <div class="grid grid-3" style="margin-bottom:18px;">
      <div class="card stat-card"><div class="stat-label">Pending Arrival Check-In</div><div class="stat-value" style="color:var(--warn);">${pendingArrivals.length}</div></div>
      <div class="card stat-card"><div class="stat-label">Checked In Today</div><div class="stat-value" style="color:var(--success);">${checkedInToday}</div></div>
      <div class="card stat-card"><div class="stat-label">Pending Insurance Policies</div><div class="stat-value" style="color:var(--teal-300);">${pendingInsurance}</div></div>
    </div>
    <div class="card"><div class="card-head"><h3>Today's Patient Arrival Check-In Roster (Waiting Queue)</h3><span class="muted">${pendingArrivals.length} waiting to check in</span></div>${appointmentsTable(appointments)}</div>`;
  }

  if (role === 'clinician') {
    const [{ patients }, { appointments }] = await Promise.all([
      api('/api/patients'), api('/api/appointments')
    ]);
    const checkedInQueue = (appointments || []).filter(a => a.status === 'Checked in');

    return pageHead('Clinical', `Welcome back, ${state.user.name}`, "Your active consultation queue and clinical documentation portal.") + `
    <div class="grid grid-3" style="margin-bottom:18px;">
      <div class="card stat-card"><div class="stat-label">Checked-In Patients Queue</div><div class="stat-value" style="color:var(--teal-300);">${checkedInQueue.length}</div></div>
      <div class="card stat-card"><div class="stat-label">Total Roster Patients</div><div class="stat-value">${patients.length}</div></div>
      <div class="card stat-card"><div class="stat-label">New Patient Intakes</div><div class="stat-value">${patients.filter(p => p.flag === 'new').length}</div></div>
    </div>
    <div class="card" style="margin-bottom:18px;">
      <div class="card-head"><h3>Checked-In Patients Queue (Waiting for Doctor Consultation)</h3><span class="muted">${checkedInQueue.length} checked in</span></div>
      ${checkedInQueue.length ? `
      <table>
        <thead><tr><th>Time</th><th>Patient</th><th>Department</th><th>Type</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          ${checkedInQueue.map(a => `<tr>
            <td><strong>${a.time}</strong></td>
            <td><strong>${escapeHtml(a.patient)}</strong></td>
            <td>${escapeHtml(a.department || 'Outpatient General')}</td>
            <td>${escapeHtml(a.type)}</td>
            <td><span class="chip chip-success">Checked in</span></td>
            <td><a href="#/discharge?patient=${encodeURIComponent(a.patient)}" class="btn btn-small btn-primary">Start Consultation / Discharge</a></td>
          </tr>`).join('')}
        </tbody>
      </table>` : '<div class="empty-state">No checked-in patients waiting in consultation queue.</div>'}
    </div>
    <div class="card"><div class="card-head"><h3>Recent Patient Roster</h3><span class="muted">MRNs masked by default</span></div>${patientsTable(patients.slice(0, 5))}</div>`;
  }

  if (role === 'patient') {
    const [{ appointments }, { claims }] = await Promise.all([
      api('/api/appointments/mine'), api('/api/claims/mine'),
    ]);
    const balance = claims.filter(c => c.status !== 'Paid').reduce((s, c) => s + c.amount, 0);
    return pageHead('Patient portal', `Welcome back, ${state.user.name.split(' ')[0]}`, "Your appointments, records and billing in one place.") + `
    <div class="grid grid-3" style="margin-bottom:18px;">
      <div class="card stat-card"><div class="stat-label">Next appointment</div><div class="stat-value" style="font-size:18px;">${appointments[0] ? appointments[0].time + ' · ' + appointments[0].clinician : 'None scheduled'}</div></div>
      <div class="card stat-card"><div class="stat-label">Outstanding balance</div><div class="stat-value">${money(balance)}</div></div>
      <div class="card stat-card"><div class="stat-label">Appointments booked</div><div class="stat-value">${appointments.length}</div></div>
    </div>
    <div class="card"><div class="card-head"><h3>Your upcoming appointments</h3></div>${appointmentsTable(appointments)}</div>`;
  }

  // Billing Dashboard
  const { claims, invoices } = await api('/api/billing/accounts');
  const outstanding = claims.filter(c => c.status !== 'Paid').reduce((s, c) => s + c.amount, 0);
  const pendingInvoices = (invoices || []).filter(i => i.status !== 'Paid').length;
  return pageHead('Billing', `Good morning, ${state.user.name.split(' ')[0]}`, "Claims pipeline and account balances.") + `
    <div class="grid grid-3" style="margin-bottom:18px;">
      <div class="card stat-card"><div class="stat-label">Outstanding Receivables</div><div class="stat-value">${money(outstanding)}</div></div>
      <div class="card stat-card"><div class="stat-label">Invoices Issued / Pending</div><div class="stat-value">${pendingInvoices}</div></div>
      <div class="card stat-card"><div class="stat-label">Total Claims Processed</div><div class="stat-value">${claims.length}</div></div>
    </div>
    <div class="card"><div class="card-head"><h3>Recent Claims Pipeline</h3></div>${claimsTable(claims.slice(0, 6))}</div>`;
}

/* ---------- 2. Interactive Insurance Verification & Policy Registration ---------- */
async function renderInsurance() {
  const { insurance, companies } = await api('/api/insurance');
  const canAdd = ['reception', 'billing', 'admin'].includes(state.user.role);

  return pageHead('Insurance Module', 'Insurance Companies & Patient Policy Verification', 'Manage health funds, verify patient coverage & register new insurance policies.') + `
    <div class="grid grid-3">
      <div class="card" style="grid-column: span 2;">
        <div class="card-head"><h3>Patient Insurance Verification List</h3></div>
        <table><thead><tr><th>Patient</th><th>Payer</th><th>Policy no.</th><th>Coverage Tier</th><th>Action Details</th><th>Status</th><th>Actions</th></tr></thead><tbody>
          ${insurance.map(i => `<tr>
            <td><strong>${escapeHtml(i.patient)}</strong></td>
            <td>${escapeHtml(i.payer)}</td>
            <td class="mask">${escapeHtml(i.policy)} <button class="mask-toggle" data-reveal-policy="${escapeHtml(i._patient || i.patient)}">Show</button></td>
            <td>${escapeHtml(i.coverage || 'Standard Cover')}</td>
            <td><small style="color:var(--ink-soft);">${escapeHtml(i.actionNote || 'Active coverage')}</small></td>
            <td>${statusChip(i.status)}</td>
            <td>${i.status !== 'Verified' ? `<button class="btn btn-small btn-primary btn-verify-insurance" data-patient="${escapeHtml(i._patient || i.patient)}">Verify &amp; Resolve</button>` : '<span class="muted" style="font-size:12px;">Verified</span>'}</td>
          </tr>`).join('')}
        </tbody></table>
      </div>
      ${canAdd ? `
      <div class="card">
        <div class="card-head"><h3>Add Patient Insurance Policy</h3></div>
        <form id="addPolicyForm">
          <label class="field"><span>Patient Name</span><input type="text" id="polPatient" placeholder="e.g. M. Alvarez" required></label>
          <label class="field"><span>Payer / Insurer</span>
            <select id="polPayer">
              <option value="Medibank">Medibank Private</option>
              <option value="Medicare">Medicare Australia</option>
              <option value="Bupa">Bupa Health Insurance</option>
              <option value="HCF">HCF Insurance</option>
              <option value="NIB">NIB Health</option>
            </select>
          </label>
          <label class="field"><span>Policy Number</span><input type="text" id="polNumber" placeholder="e.g. MB-99120" required></label>
          <label class="field"><span>Coverage Tier</span><input type="text" id="polCoverage" value="Gold Comprehensive Extra"></label>
          <label class="field"><span>Co-Pay Amount ($)</span><input type="text" id="polCopay" value="$0.00"></label>
          <button type="submit" class="btn btn-primary btn-block">Register Insurance Policy</button>
        </form>
      </div>` : ''}
    </div>`;
}

/* ---------- 3. Interactive Claims Pipeline ---------- */
async function renderClaims() {
  const [{ claims }, { patients }] = await Promise.all([
    api('/api/claims'), api('/api/patients')
  ]);
  const canSubmit = ['billing', 'admin'].includes(state.user.role);
  const patientOptions = (patients || []).map(p => `<option value="${escapeHtml(p.name)}">${escapeHtml(p.name)} (MRN: ${p.id})</option>`).join('');

  return pageHead('Claims Module', 'Insurance Claims & Approval Pipeline', 'Submit, verify eligibility, and track health fund claim approvals.') + `
    <div class="grid grid-3">
      <div class="card" style="grid-column: span 2;">
        <div class="card-head">
          <h3>Submitted Insurance Claims</h3>
          ${canSubmit ? '<button class="btn btn-ghost btn-small" id="btnExportClaims">Export to Excel</button>' : ''}
        </div>
        ${claimsTable(claims)}
      </div>
      ${canSubmit ? `
      <div class="card">
        <div class="card-head"><h3>Submit New Insurance Claim</h3></div>
        <form id="submitClaimForm">
          <label class="field"><span>Select Patient (MRN / Name)</span>
            <select id="clmPatient" required>
              <option value="">Select patient…</option>
              ${patientOptions}
            </select>
          </label>
          <label class="field"><span>Health Fund / Payer</span>
            <select id="clmPayer">
              <option value="Medibank">Medibank Private</option>
              <option value="Medicare">Medicare Australia</option>
              <option value="Bupa">Bupa Health Insurance</option>
              <option value="HCF">HCF Insurance</option>
            </select>
          </label>
          <label class="field"><span>Procedure Code</span><input type="text" id="clmCode" value="GP-01 (General Consult)"></label>
          <label class="field"><span>Claim Amount ($)</span><input type="number" id="clmAmount" value="135.00" step="5" required></label>
          <button type="submit" class="btn btn-primary btn-block">Submit Claim</button>
        </form>
      </div>` : ''}
    </div>`;
}

/* ---------- 4. Interactive Invoicing & Billing ---------- */
async function renderBilling() {
  const [{ claims, invoices }, { patients }] = await Promise.all([
    api('/api/billing'), api('/api/patients')
  ]);
  const canBill = ['billing', 'admin'].includes(state.user.role);
  const patientOptions = (patients || []).map(p => `<option value="${escapeHtml(p.name)}">${escapeHtml(p.name)} (MRN: ${p.id})</option>`).join('');

  return pageHead('Billing Module', 'Invoice Generation & Charges', 'Create itemized patient bills, consultation charges, and procedure fees.') + `
    <div class="grid grid-3">
      <div class="card" style="grid-column: span 2;">
        <div class="card-head"><h3>Generated Invoices</h3></div>
        <table><thead><tr><th>Invoice ID</th><th>Patient Name</th><th>Date</th><th>Subtotal</th><th>Insurer Reimb.</th><th>Patient Copay</th><th>Status</th></tr></thead><tbody>
          ${(invoices || []).map(inv => `<tr>
            <td><strong>${inv.id}</strong></td>
            <td>${escapeHtml(inv.patientName)}</td>
            <td>${inv.date}</td>
            <td>${money(inv.subtotal)}</td>
            <td style="color:var(--teal-300);">${money(inv.insurerReimbursement)}</td>
            <td style="color:var(--warn);">${money(inv.patientCoPay)}</td>
            <td>${statusChip(inv.status)}</td>
          </tr>`).join('')}
        </tbody></table>
      </div>
      ${canBill ? `
      <div class="card">
        <div class="card-head"><h3>Generate New Invoice</h3></div>
        <form id="createInvoiceForm">
          <label class="field"><span>Select Patient (MRN / Name)</span>
            <select id="invPatient" required>
              <option value="">Select patient…</option>
              ${patientOptions}
            </select>
          </label>
          <label class="field"><span>Service Description</span><input type="text" id="invDesc" value="Consultation & 12-Lead ECG Imaging"></label>
          <label class="field"><span>Total Fee Amount ($)</span><input type="number" id="invTotal" value="245.00" step="5" required></label>
          <label class="field"><span>Insurer Share ($)</span><input type="number" id="invInsShare" value="182.40" step="5"></label>
          <button type="submit" class="btn btn-primary btn-block">Generate Invoice</button>
        </form>
      </div>` : ''}
    </div>`;
}

/* ---------- 5. Interactive Payment Tracking & Receipts ---------- */
async function renderPayments() {
  const [{ payments, invoices }, { patients }] = await Promise.all([
    api('/api/billing'), api('/api/patients')
  ]);
  const canPay = ['billing', 'admin'].includes(state.user.role);
  const patientOptions = (patients || []).map(p => `<option value="${escapeHtml(p.name)}">${escapeHtml(p.name)} (MRN: ${p.id})</option>`).join('');

  return pageHead('Financial Operations', 'Payment Tracking & Receipt Settlement', 'Record co-pays, EFTPOS card payments, and insurance payouts.') + `
    <div class="grid grid-3">
      <div class="card" style="grid-column: span 2;">
        <div class="card-head"><h3>Recorded Payment Receipts</h3></div>
        <table><thead><tr><th>Receipt Ref</th><th>Invoice ID</th><th>Patient Name</th><th>Date</th><th>Amount</th><th>Method</th></tr></thead><tbody>
          ${(payments || []).map(p => `<tr>
            <td><strong>${escapeHtml(p.receiptRef || p.id)}</strong></td>
            <td>${escapeHtml(p.invoiceId || 'INV-2026-001')}</td>
            <td>${escapeHtml(p.patientName)}</td>
            <td>${p.date || 'Today'}</td>
            <td style="color:var(--success); font-weight:700;">${money(p.amount)}</td>
            <td><span class="chip chip-teal">${escapeHtml(p.method)}</span></td>
          </tr>`).join('')}
        </tbody></table>
      </div>
      ${canPay ? `
      <div class="card">
        <div class="card-head"><h3>Record Payment Receipt</h3></div>
        <form id="recordPaymentForm">
          <label class="field"><span>Invoice ID</span><input type="text" id="payInvId" placeholder="e.g. INV-2026-001"></label>
          <label class="field"><span>Select Patient (MRN / Name)</span>
            <select id="payPatient" required>
              <option value="">Select patient…</option>
              ${patientOptions}
            </select>
          </label>
          <label class="field"><span>Payment Amount ($)</span><input type="number" id="payAmount" value="62.60" step="1" required></label>
          <label class="field"><span>Payment Method</span>
            <select id="payMethod">
              <option value="Credit Card (EFTPOS)">Credit Card (EFTPOS)</option>
              <option value="Cash Deposit">Cash Deposit</option>
              <option value="Medicare Direct EFT">Medicare Direct EFT</option>
              <option value="Health Fund Settlement">Health Fund Settlement</option>
            </select>
          </label>
          <button type="submit" class="btn btn-primary btn-block">Record Payment</button>
        </form>
      </div>` : ''}
    </div>`;
}

/* ---------- Users & Roles (Admin) ---------- */
async function renderUsers() {
  const { users } = await api('/api/admin/users');
  return pageHead('Admin', 'Users & Role-Based Access Control', 'Manage system user accounts, roles, and security lockouts.') + `
    <div class="grid grid-3">
      <div class="card" style="grid-column: span 2;">
        <div class="card-head"><h3>Registered Users</h3></div>
        <table><thead><tr><th>Username</th><th>Name</th><th>Role</th><th>Failed Logins</th><th>Lock Status</th><th>Action</th></tr></thead><tbody>
          ${users.map(u => `<tr>
            <td><strong>${u.username}</strong></td>
            <td>${escapeHtml(u.name)}</td>
            <td><span class="chip chip-teal">${u.role}</span></td>
            <td>${u.failedLogins}</td>
            <td>${u.locked ? '<span class="chip chip-danger">Locked</span>' : '<span class="chip chip-success">Active</span>'}</td>
            <td><button class="btn btn-small ${u.locked ? 'btn-primary' : 'btn-ghost'} btn-toggle-lock" data-id="${u.id}">${u.locked ? 'Unlock' : 'Lock Account'}</button></td>
          </tr>`).join('')}
        </tbody></table>
      </div>
      <div class="card">
        <div class="card-head"><h3>Create Staff User</h3></div>
        <form id="createUserForm">
          <label class="field"><span>Username</span><input type="text" id="newUsername" placeholder="e.g. dr.taylor" required></label>
          <label class="field"><span>Full Name</span><input type="text" id="newName" placeholder="e.g. Dr. E. Taylor" required></label>
          <label class="field"><span>Role</span>
            <select id="newRole">
              <option value="reception">Reception</option>
              <option value="clinician">Clinician (Doctor)</option>
              <option value="billing">Billing</option>
              <option value="admin">System Admin</option>
            </select>
          </label>
          <label class="field"><span>Default Password</span><input type="password" id="newPassword" value="Clinic#2026" required></label>
          <button type="submit" class="btn btn-primary btn-block">Create Account</button>
        </form>
      </div>
    </div>`;
}

/* ---------- Departments Page ---------- */
async function renderDepartments() {
  const { departments } = await api('/api/admin/departments');
  return pageHead('Administration', 'Clinic Departments', 'Manage operating medical departments and clinical leadership.') + `
    <div class="grid grid-3" style="margin-bottom:18px;">
      ${departments.map(d => `<div class="card">
        <h3 style="margin-bottom:4px; color:var(--teal-300);">${escapeHtml(d.name)}</h3>
        <p style="font-size:13px; color:var(--ink-soft); margin-bottom:8px;">Head: <strong>${escapeHtml(d.head)}</strong></p>
        <div style="font-size:12px; color:var(--ink-faint);">${escapeHtml(d.floor)} · ${escapeHtml(d.phone)}</div>
      </div>`).join('')}
    </div>
    ${state.user.role === 'admin' ? `
    <div class="card" style="max-width:500px;">
      <div class="card-head"><h3>Add New Department</h3></div>
      <form id="addDeptForm">
        <label class="field"><span>Department Name</span><input type="text" id="deptName" placeholder="e.g. Ophthalmology" required></label>
        <label class="field"><span>Department Head</span><input type="text" id="deptHead" placeholder="e.g. Dr. S. Mehta" required></label>
        <label class="field"><span>Floor / Location</span><input type="text" id="deptFloor" placeholder="Level 2, Block C"></label>
        <button type="submit" class="btn btn-primary">Add Department</button>
      </form>
    </div>` : ''}`;
}

/* ---------- Consultants Page ---------- */
async function renderConsultants() {
  const { consultants } = await api('/api/consultants');
  return pageHead('Directory', 'Consultants & Specialists', 'View consultant specializations, consultation fees, and working hours.') + `
    <div class="grid grid-3" style="margin-bottom:18px;">
      ${consultants.map(c => `<div class="card">
        <div class="card-head"><h3 style="color:var(--teal-300);">${escapeHtml(c.name)}</h3><span class="chip chip-success">${money(c.fee)}</span></div>
        <p style="font-size:13px; font-weight:600; color:var(--ink-soft);">${escapeHtml(c.specialization)}</p>
        <p style="font-size:12px; color:var(--ink-faint); margin:6px 0;">${escapeHtml(c.bio)}</p>
        <div style="font-size:11.5px; color:var(--teal-400); margin-top:8px;">📅 Available: ${escapeHtml(c.availableDays)}</div>
      </div>`).join('')}
    </div>
    ${state.user.role === 'admin' ? `
    <div class="card" style="max-width:550px;">
      <div class="card-head"><h3>Register New Consultant</h3></div>
      <form id="addConsultantForm">
        <label class="field"><span>Consultant Name</span><input type="text" id="docName" placeholder="Dr. E. Taylor" required></label>
        <label class="field"><span>Specialization</span><input type="text" id="docSpec" placeholder="Radiology & Imaging" required></label>
        <label class="field"><span>Department</span><input type="text" id="docDept" placeholder="Radiology & Imaging" required></label>
        <label class="field"><span>Base Consultation Fee ($)</span><input type="number" id="docFee" value="180.00" step="10"></label>
        <button type="submit" class="btn btn-primary">Register Consultant</button>
      </form>
    </div>` : ''}`;
}

/* ---------- Add Patient Form ---------- */
function renderAddPatient() {
  return pageHead('Reception', 'Register New Patient File', 'Create a new official patient demographic file.') + `
    <div class="card" style="max-width:600px;">
      <form id="addPatientForm">
        <label class="field"><span>Full Patient Name</span><input type="text" id="pName" placeholder="e.g. Jane Doe" required></label>
        <label class="field"><span>Date of Birth</span><input type="text" id="pDob" placeholder="DD MMM YYYY, e.g. 15 Aug 1990" required></label>
        <label class="field"><span>Phone Number</span><input type="text" id="pPhone" placeholder="04xx xxx xxx" required></label>
        <label class="field"><span>Known Allergies</span><input type="text" id="pAllergies" placeholder="e.g. Penicillin, Latex or None known"></label>
        <label class="field"><span>Emergency Contact</span><input type="text" id="pEmergency" placeholder="Name & Phone number"></label>
        <label class="field"><span>Clinical Flag</span>
          <select id="pFlag">
            <option value="new">New Patient</option>
            <option value="chronic">Chronic Care</option>
            <option value="cardiology">Cardiology</option>
            <option value="maternity">Maternity</option>
            <option value="none">General Care</option>
          </select>
        </label>
        <button type="submit" class="btn btn-primary btn-block">Register Patient</button>
      </form>
    </div>`;
}

/* ---------- Medical Records & Prescriptions ---------- */
async function renderMedicalRecords() {
  const { medicalRecords } = await api('/api/medical-records');
  const canRecord = ['clinician', 'admin'].includes(state.user.role);

  return pageHead('Clinical', 'Medical Records & Clinical History', 'Full clinical progress notes, diagnoses, and vitals history.') + `
    <div class="grid grid-3">
      <div class="card" style="grid-column: span 2;">
        <div class="card-head"><h3>Patient Medical History &amp; Vitals</h3></div>
        <table><thead><tr><th>Date</th><th>Patient Name</th><th>Doctor</th><th>Diagnosis (ICD)</th><th>BP / Pulse</th><th>Clinical Notes</th></tr></thead><tbody>
          ${(medicalRecords || []).map(r => `<tr>
            <td>${r.date}</td>
            <td><strong>${escapeHtml(r.patientName)}</strong></td>
            <td>${escapeHtml(r.doctorName)}</td>
            <td><span class="chip chip-teal">${escapeHtml(r.diagnosis)}</span></td>
            <td>${r.bp || '120/80'} (${r.pulse || 72} bpm)</td>
            <td><small style="color:var(--ink-soft);">${escapeHtml(r.notes)}</small></td>
          </tr>`).join('')}
        </tbody></table>
      </div>
      ${canRecord ? `
      <div class="card">
        <div class="card-head"><h3>Record Vitals &amp; Progress Note</h3></div>
        <form id="addRecordForm">
          <label class="field"><span>Patient Name</span><input type="text" id="recPatient" placeholder="e.g. M. Alvarez" required></label>
          <label class="field"><span>ICD Diagnosis</span><input type="text" id="recDiagnosis" placeholder="e.g. Acute Bronchitis (ICD J20)" required></label>
          <label class="field"><span>Blood Pressure (BP)</span><input type="text" id="recBp" value="122/80 mmHg"></label>
          <label class="field"><span>Pulse Rate (bpm)</span><input type="number" id="recPulse" value="74"></label>
          <label class="field"><span>Clinical Progress Note</span><textarea id="recNotes" placeholder="Record patient symptoms, physical examination findings, and clinical evaluation..."></textarea></label>
          <button type="submit" class="btn btn-primary btn-block">Save Clinical Record</button>
        </form>
      </div>` : ''}
    </div>`;
}

async function renderPrescriptions() {
  const { prescriptions } = await api('/api/medical-records/prescriptions');
  const canIssue = ['clinician'].includes(state.user.role);

  return pageHead('Clinical', 'e-Prescriptions (Rx)', 'Active medications, dosage instructions, and script history.') + `
    <div class="grid grid-3">
      <div class="card" style="grid-column: span 2;">
        <div class="card-head"><h3>Active e-Prescriptions</h3></div>
        ${prescriptions.map(p => `
          <div class="rx-card">
            <div class="rx-header">
              <span class="rx-title">💊 ${escapeHtml(p.medication)}</span>
              ${statusChip(p.status)}
            </div>
            <p style="font-size:13px; margin:4px 0;">Patient: <strong>${escapeHtml(p.patientName)}</strong> · Prescribed by: ${escapeHtml(p.doctorName)}</p>
            <p style="font-size:12.5px; color:var(--ink-soft); margin-bottom:4px;">Dosage: <em>${escapeHtml(p.dosage)}</em> (${escapeHtml(p.duration)})</p>
            <small style="color:var(--teal-400);">Rx ID: ${p.id} · Refills remaining: ${p.refillsLeft || 3}</small>
          </div>`).join('')}
      </div>
      ${canIssue ? `
      <div class="card">
        <div class="card-head"><h3>Issue e-Prescription</h3></div>
        <form id="rxForm">
          <label class="field"><span>Patient Name</span><input type="text" id="rxPatient" placeholder="M. Alvarez" required></label>
          <label class="field"><span>Medication Name</span><input type="text" id="rxMed" placeholder="Amoxicillin 500mg" required></label>
          <label class="field"><span>Dosage Instructions</span><input type="text" id="rxDosage" placeholder="1 capsule TDS with meals" required></label>
          <label class="field"><span>Duration</span><input type="text" id="rxDuration" value="7 days"></label>
          <button type="submit" class="btn btn-primary btn-block">Issue Prescription</button>
        </form>
      </div>` : ''}
    </div>`;
}

/* ---------- Care Workflow Stepper Page ---------- */
async function renderWorkflow() {
  const { cases } = await api('/api/workflow/cases');

  return pageHead('Clinical Operations', '6-Step Care Lifecycle Stepper', 'Track and execute patient care from Appointment to Payment settlement.') + `
    <div class="notice notice-info" style="margin-bottom:18px;">
      Lifecycle: <strong>1. Appointment</strong> ➔ <strong>2. Treatment</strong> ➔ <strong>3. Invoice</strong> ➔ <strong>4. Insurance Claim</strong> ➔ <strong>5. Claim Approval</strong> ➔ <strong>6. Payment</strong>
    </div>
    <div class="card">
      <div class="card-head"><h3>Active Patient Cases</h3></div>
      <table><thead><tr><th>Patient</th><th>Clinician</th><th>Appointment Time</th><th>Current Step</th><th>Status</th><th>Execute Next Step</th></tr></thead><tbody>
        ${cases.map(c => `<tr>
          <td><strong>${escapeHtml(c.patient)}</strong></td>
          <td>${escapeHtml(c.clinician)}</td>
          <td>${c.time}</td>
          <td><span class="chip chip-teal">Step ${c.currentStep}: ${c.stepName}</span></td>
          <td>${statusChip(c.appointmentStatus)}</td>
          <td>
            ${c.currentStep < 6 
              ? `<button class="btn btn-small btn-primary btn-advance-workflow" data-id="${c.caseId}" data-step="${c.currentStep + 1}">Advance to Step ${c.currentStep + 1}</button>`
              : '<span class="chip chip-success">Completed &amp; Settled</span>'}
          </td>
        </tr>`).join('')}
      </tbody></table>
    </div>`;
}

/* ---------- Discharge Summary ---------- */
async function renderDischarge() {
  let patientOptions = '';
  const hashParts = window.location.hash.split('?');
  const urlParams = new URLSearchParams(hashParts[1] || '');
  const preselectedPatient = urlParams.get('patient') || '';

  try {
    const { patients } = await api('/api/patients');
    patientOptions = patients.map(p => {
      const isSel = preselectedPatient && preselectedPatient.toLowerCase() === p.name.toLowerCase();
      return `<option value="${escapeHtml(p.name)}" ${isSel ? 'selected' : ''}>${escapeHtml(p.name)}</option>`;
    }).join('');
  } catch { /* fall through */ }

  return pageHead('Clinical', 'Discharge Summary', 'Generated at the end of a course of treatment. Selecting a patient or clicking a template auto-populates all 5 required fields.') + `
    <div class="notice notice-info">Discharge summaries are written to the patient's permanent medical record. Select a patient or click a preset below to auto-fill all 5 fields.</div>
    <div class="card">
      <div class="preset-bar" style="margin-bottom:18px; padding:12px 16px; background:var(--surface-2); border-radius:var(--radius-s); display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
        <span style="font-size:12px; font-weight:600; color:var(--teal-700);">Quick Presets:</span>
        <button type="button" class="btn btn-ghost btn-small btn-preset" data-preset="bronchitis">🫁 Acute Bronchitis</button>
        <button type="button" class="btn btn-ghost btn-small btn-preset" data-preset="chestpain">🫀 Chest Pain (ECG Clear)</button>
        <button type="button" class="btn btn-ghost btn-small btn-preset" data-preset="hypertension">🩸 Hypertension Review</button>
        <button type="button" class="btn btn-ghost btn-small btn-preset-clear" style="margin-left:auto;">🧹 Clear Form</button>
      </div>
      <form id="dischargeForm">
        <div class="form-grid">
          <label class="field"><span>Patient</span><select id="dxPatient"><option value="">Select patient…</option>${patientOptions}</select></label>
          <label class="field"><span>Attending clinician</span><input type="text" value="${escapeHtml(state.user.name)}" readonly></label>
          <label class="field full"><span>Chief complaint</span><input type="text" id="dxComplaint" placeholder="e.g. Shortness of breath"></label>
          <label class="field full"><span>Findings &amp; diagnosis</span><textarea id="dxFindings"></textarea></label>
          <label class="field full"><span>Therapy administered &amp; response</span><textarea id="dxTherapy"></textarea></label>
          <label class="field full"><span>Recommendations on discharge</span><textarea id="dxRecs"></textarea></label>
          <label class="field full"><span>Lab &amp; Diagnostic Test Results</span><textarea id="dxLabResults"></textarea></label>
        </div>
        <button type="submit" class="btn btn-primary" style="margin-top:12px;">Save &amp; Sign Off</button>
      </form>
    </div>`;
}

/* ---------- Audit Logs ---------- */
async function renderAuditLogs() {
  const { entries } = await api('/api/audit');
  const rows = (entries || []).slice().reverse();
  return pageHead('Security Compliance', 'Security Audit Logs Feed', 'Immutable record of authentication events, PHI views, and access controls.') + `
    <div class="card">
      <table><thead><tr><th>Timestamp</th><th>Actor</th><th>Role</th><th>Type</th><th>Action Log</th></tr></thead><tbody id="auditLogTableBody">
        ${rows.map(e => `<tr>
          <td>${fmtTime(e.ts)}</td>
          <td><strong>${escapeHtml(e.actor)}</strong></td>
          <td><span class="chip chip-teal">${escapeHtml(e.role)}</span></td>
          <td><span class="chip ${e.type === 'deny' ? 'chip-danger' : 'chip-neutral'}">${escapeHtml(e.type)}</span></td>
          <td>${e.action}</td>
        </tr>`).join('')}
      </tbody></table>
    </div>`;
}

/* ---------- System Settings ---------- */
async function renderSettings() {
  const { settings } = await api('/api/admin/settings');
  return pageHead('Admin', 'System Settings & Security', 'Configure clinic operational parameters, password policy, and timeouts.') + `
    <div class="card" style="max-width:600px;">
      <form id="settingsForm">
        <label class="field"><span>Clinic Name</span><input type="text" id="cfgName" value="${escapeHtml(settings.clinicName)}"></label>
        <label class="field"><span>Session Inactivity Timeout (Minutes)</span><input type="number" id="cfgTimeout" value="${settings.sessionTimeoutMinutes}"></label>
        <label class="field"><span>Max Failed Login Attempts</span><input type="number" id="cfgMaxLogins" value="${settings.maxFailedLogins}"></label>
        <label class="field" style="flex-direction:row; align-items:center; gap:8px;">
          <input type="checkbox" id="cfgMfa" ${settings.mfaRequired ? 'checked' : ''}>
          <span>Enforce Multi-Factor Authentication (MFA) for staff</span>
        </label>
        <button type="submit" class="btn btn-primary">Save System Settings</button>
      </form>
    </div>`;
}

/* ---------- User Profile ---------- */
function renderProfile() {
  return pageHead('User Profile', 'Account Overview', 'Your staff credentials and security settings.') + `
    <div class="card" style="max-width:500px;">
      <table><tbody>
        <tr><th>User ID</th><td>${escapeHtml(state.user.sub || state.user.id || 'usr-101')}</td></tr>
        <tr><th>Username</th><td>${escapeHtml(state.user.username)}</td></tr>
        <tr><th>Full Name</th><td>${escapeHtml(state.user.name)}</td></tr>
        <tr><th>Role</th><td><span class="chip chip-teal">${escapeHtml(state.user.role)}</span></td></tr>
        <tr><th>Session Status</th><td><span class="chip chip-success">Authenticated (MFA Verified)</span></td></tr>
      </tbody></table>
    </div>`;
}

/* ---------- Patient Portal Views ---------- */
async function renderMyAppointments() {
  const { appointments } = await api('/api/appointments/mine');
  const { consultants } = await api('/api/consultants');

  return pageHead('Patient Portal', 'My Appointments', 'View scheduled visits and book new clinical consultations.') + `
    <div class="grid grid-3">
      <div class="card" style="grid-column: span 2;">
        <div class="card-head"><h3>Your Scheduled Visits</h3></div>
        ${appointmentsTable(appointments)}
      </div>
      <div class="card">
        <div class="card-head"><h3>Book New Visit</h3></div>
        <form id="bookApptForm">
          <label class="field"><span>Select Doctor / Specialist</span>
            <select id="bookDoctor">
              ${(consultants || []).map(c => `<option value="${escapeHtml(c.name)}">${escapeHtml(c.name)} — ${escapeHtml(c.specialization)} (${money(c.fee)})</option>`).join('')}
            </select>
          </label>
          <label class="field"><span>Preferred Time Slot</span>
            <select id="bookTime">
              <option value="9:00 AM">9:00 AM</option>
              <option value="9:30 AM">9:30 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:15 AM">11:15 AM</option>
              <option value="1:30 PM">1:30 PM</option>
              <option value="2:30 PM">2:30 PM</option>
            </select>
          </label>
          <label class="field"><span>Reason for Visit</span><input type="text" id="bookReason" placeholder="e.g. General Consult / Cardiology Follow-up" required></label>
          <button type="submit" class="btn btn-primary btn-block">Confirm Appointment Booking</button>
        </form>
      </div>
    </div>`;
}

async function renderMyRecords() {
  const { patient } = await api('/api/patients/mine');
  return pageHead('Patient Portal', 'My Medical Records', 'Summary of your clinical record.') + `
    <div class="card">
      <table><tbody>
        <tr><th>Full Name</th><td>${escapeHtml(patient ? patient.name : state.user.name)}</td></tr>
        <tr><th>DOB</th><td>${escapeHtml(patient ? patient.dob : '—')}</td></tr>
        <tr><th>Known Allergies</th><td>${escapeHtml(patient ? patient.allergies : '—')}</td></tr>
      </tbody></table>
    </div>`;
}

async function renderMyBilling() {
  const data = await api('/api/billing/mine');
  const invoices = data.invoices || [];
  const claims = data.claims || [];

  return pageHead('Patient Portal', 'My Claims & Billing Statements', 'View itemized invoices, file health fund claims, and settle copay balances.') + `
    <div class="card" style="margin-bottom:20px;">
      <div class="card-head"><h3>Itemized Care Invoices &amp; Patient Balance</h3></div>
      ${invoices.length ? `
      <table>
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Date</th>
            <th>Total Fee</th>
            <th>Health Fund Share</th>
            <th>Your Copay</th>
            <th>Status</th>
            <th>Patient Action Options</th>
          </tr>
        </thead>
        <tbody>
          ${invoices.map(inv => {
            const hasClaim = claims.some(c => (c.patient || '').toLowerCase() === state.user.name.toLowerCase());
            const isPaid = inv.status === 'Paid';
            return `
            <tr>
              <td><strong>${escapeHtml(inv.id)}</strong></td>
              <td>${inv.date}</td>
              <td>${money(inv.subtotal)}</td>
              <td><span class="chip chip-teal">${money(inv.insurerReimbursement)}</span></td>
              <td><strong style="color:var(--clay);">${money(inv.patientCoPay)}</strong></td>
              <td>${statusChip(inv.status)}</td>
              <td>
                ${isPaid ? '<span class="chip chip-success">Invoice Settled</span>' : `
                  <div style="display:flex; gap:6px;">
                    <button class="btn btn-small btn-secondary btn-file-claim" data-inv-id="${escapeHtml(inv.id)}" data-amount="${inv.insurerReimbursement}" ${hasClaim ? 'disabled' : ''}>
                      ${hasClaim ? 'Claim Filed' : 'File Insurance Claim'}
                    </button>
                    <button class="btn btn-small btn-primary btn-pay-copay" data-inv-id="${escapeHtml(inv.id)}" data-copay="${inv.patientCoPay}">
                      Pay Copay (${money(inv.patientCoPay)})
                    </button>
                  </div>
                `}
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>` : '<div class="empty-state">No active invoices for your account.</div>'}
    </div>
    <div class="card">
      <div class="card-head"><h3>Submitted Insurance Claims</h3></div>
      ${claimsTable(claims)}
    </div>`;
}

async function renderMyMessages() {
  const thread = state.user.name;
  const { messages } = await api(`/api/messages/${encodeURIComponent(thread)}`);
  return pageHead('Patient Portal', 'Messaging', 'Direct channel to your care team.') + `
    <div class="card" data-thread="${escapeHtml(thread)}">
      <div class="msg-thread" id="msgThread">${messages.map(m => `<div class="msg ${m.from === state.user.name ? 'msg-out' : 'msg-in'}">${escapeHtml(m.text)}<div class="msg-meta">${fmtTime(m.ts)}</div></div>`).join('')}</div>
      <label class="field"><span>Reply</span><textarea id="patMsgReply" style="min-height:60px;"></textarea></label>
      <button class="btn btn-primary" id="btnPatSendMsg" style="margin-top:8px;">Send securely</button>
    </div>`;
}

async function renderPatients() {
  const { patients } = await api('/api/patients');
  return pageHead('Clinical', 'Patient Roster & Search', 'MRNs are masked by default; revealing requires password verification.') + `
    <div class="card">${patientsTable(patients)}</div>`;
}

async function renderMessages() {
  const thread = 'M. Alvarez';
  const { messages } = await api(`/api/messages/${encodeURIComponent(thread)}`);
  return pageHead('Clinical', 'Secure Messaging', 'Retained as part of the permanent patient record.') + `
    <div class="card" data-thread="${escapeHtml(thread)}">
      <div class="msg-thread" id="msgThread">${messages.map(m => `<div class="msg ${m.from === state.user.name ? 'msg-out' : 'msg-in'}">${escapeHtml(m.text)}<div class="msg-meta">${fmtTime(m.ts)}</div></div>`).join('')}</div>
      <label class="field"><span>Reply</span><textarea id="msgReply" style="min-height:60px;"></textarea></label>
      <button class="btn btn-primary" id="btnSendMsg" style="margin-top:8px;">Send securely</button>
    </div>`;
}

async function renderAccounts() {
  const { claims } = await api('/api/claims');
  const outstanding = claims.filter(c => c.status !== 'Paid').reduce((s, c) => s + c.amount, 0);
  const totalPaid = claims.filter(c => c.status === 'Paid').reduce((s, c) => s + c.amount, 0);

  return pageHead('Financial', 'Billing Statements & Receivables', 'Accounts receivable summary.') + `
    <div class="grid grid-2" style="margin-bottom:18px;">
      <div class="card stat-card"><div class="stat-label">Total Revenue Collected</div><div class="stat-value" style="color:var(--success);">${money(totalPaid)}</div></div>
      <div class="card stat-card"><div class="stat-label">Accounts Receivable</div><div class="stat-value" style="color:var(--danger);">${money(outstanding)}</div></div>
    </div>
    <div class="card">${claimsTable(claims)}</div>`;
}

function renderReports() {
  return pageHead('Financial', 'Financial Reports', 'Generate financial and clinical statements.') + `
    <div class="grid grid-3">
      <div class="card"><h3>Monthly Revenue Summary</h3><button class="btn btn-primary btn-small btn-generate-report" data-report-title="Monthly Revenue Summary">Generate</button></div>
      <div class="card"><h3>Claims Ageing &amp; Receivables</h3><button class="btn btn-primary btn-small btn-generate-report" data-report-title="Claims Ageing">Generate</button></div>
      <div class="card"><h3>Payer Performance</h3><button class="btn btn-primary btn-small btn-generate-report" data-report-title="Payer Performance">Generate</button></div>
    </div>
    <div id="reportContainer"></div>`;
}

/* ---------- Route Renderer Dispatcher ---------- */
const ROUTE_RENDERERS = {
  dashboard: renderDashboard,
  users: renderUsers,
  departments: renderDepartments,
  consultants: renderConsultants,
  'add-patient': renderAddPatient,
  patients: renderPatients,
  'medical-records': renderMedicalRecords,
  prescriptions: renderPrescriptions,
  discharge: renderDischarge,
  workflow: renderWorkflow,
  insurance: renderInsurance,
  claims: renderClaims,
  statements: renderAccounts,
  billing: renderBilling,
  payments: renderPayments,
  reports: renderReports,
  messages: renderMessages,
  'audit-logs': renderAuditLogs,
  settings: renderSettings,
  profile: renderProfile,
  myappointments: renderMyAppointments,
  myrecords: renderMyRecords,
  mybilling: renderMyBilling,
  mymessages: renderMyMessages,
};

/* ---------- Module Wiring & Form Handlers ---------- */
function wireModule(route) {
  // Check-In button click listener
  $$('.btn-checkin-action').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const patientName = btn.dataset.checkinName;
      try {
        await api('/api/appointments/checkin', { method: 'POST', body: { patientName } });
        toast(`Patient "${patientName}" marked as checked in.`);
        if (state.user.role === 'clinician') refreshAudit();
        render();
      } catch (err) { toast(err.message); }
    });
  });

  // Export Claims
  $('#btnExportClaims')?.addEventListener('click', async () => {
    try {
      const res = await api('/api/claims/export', { method: 'POST' });
      toast(`Claims exported cleanly — ${res.filename}`);
    } catch (e) { toast(e.message); }
  });

  // Submit Insurance Claim form
  $('#submitClaimForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      patient: $('#clmPatient').value,
      payer: $('#clmPayer').value,
      amount: $('#clmAmount').value,
      procedureCode: $('#clmCode').value,
    };
    try {
      let res;
      try {
        res = await api('/api/claims', { method: 'POST', body });
      } catch (err) {
        if (err.status === 404) {
          res = await api('/api/billing/claims', { method: 'POST', body });
        } else {
          throw err;
        }
      }
      toast(res.message);
      render();
    } catch (err) { toast(err.message); }
  });

  // Add Insurance Policy form
  $('#addPolicyForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      patient: $('#polPatient').value,
      payer: $('#polPayer').value,
      policy: $('#polNumber').value,
      coverage: $('#polCoverage').value,
      copay: $('#polCopay').value,
    };
    try {
      const res = await api('/api/insurance', { method: 'POST', body });
      toast(res.message);
      render();
    } catch (err) { toast(err.message); }
  });

  // Generate Invoice form
  $('#createInvoiceForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      patientName: $('#invPatient').value,
      description: $('#invDesc').value,
      subtotal: $('#invTotal').value,
      insurerReimbursement: $('#invInsShare').value,
    };
    try {
      const res = await api('/api/billing/invoices', { method: 'POST', body });
      toast(res.message);
      render();
    } catch (err) { toast(err.message); }
  });

  // Record Payment form
  $('#recordPaymentForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      invoiceId: $('#payInvId').value,
      patientName: $('#payPatient').value,
      amount: $('#payAmount').value,
      method: $('#payMethod').value,
    };
    try {
      const res = await api('/api/billing/payments', { method: 'POST', body });
      toast(res.message);
      render();
    } catch (err) { toast(err.message); }
  });

  // Toggle user lock in Admin
  $$('.btn-toggle-lock').forEach(btn => {
    btn.addEventListener('click', async () => {
      try {
        const res = await api(`/api/admin/users/${btn.dataset.id}/toggle-lock`, { method: 'POST' });
        toast(res.message);
        render();
      } catch (e) { toast(e.message); }
    });
  });

  // Create User form
  $('#createUserForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      username: $('#newUsername').value,
      name: $('#newName').value,
      role: $('#newRole').value,
      password: $('#newPassword').value,
    };
    try {
      await api('/api/admin/users', { method: 'POST', body });
      toast('Staff account created successfully.');
      render();
    } catch (err) { toast(err.message); }
  });

  // Add Department form
  $('#addDeptForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      name: $('#deptName').value,
      head: $('#deptHead').value,
      floor: $('#deptFloor').value,
    };
    try {
      await api('/api/admin/departments', { method: 'POST', body });
      toast('Department added.');
      render();
    } catch (err) { toast(err.message); }
  });

  // Register Consultant form
  $('#addConsultantForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      name: $('#docName').value,
      specialization: $('#docSpec').value,
      department: $('#docDept').value,
      fee: $('#docFee').value,
    };
    try {
      await api('/api/consultants', { method: 'POST', body });
      toast('Consultant registered successfully.');
      render();
    } catch (err) { toast(err.message); }
  });

  // Add Patient form
  $('#addPatientForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      name: $('#pName').value,
      dob: $('#pDob').value,
      phone: $('#pPhone').value,
      allergies: $('#pAllergies').value,
      emergencyContact: $('#pEmergency').value,
      flag: $('#pFlag').value,
    };
    try {
      const res = await api('/api/register', { method: 'POST', body });
      toast(res.message || 'Patient file and Patient Portal account created successfully.');
      window.location.hash = '#/patients';
    } catch (err) { toast(err.message); }
  });

  // Issue Rx form
  $('#rxForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      patientName: $('#rxPatient').value,
      medication: $('#rxMed').value,
      dosage: $('#rxDosage').value,
      duration: $('#rxDuration').value,
    };
    try {
      await api('/api/medical-records/prescriptions', { method: 'POST', body });
      toast('e-Prescription issued.');
      render();
    } catch (err) { toast(err.message); }
  });

  // Add Medical Record form
  $('#addRecordForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      patientName: $('#recPatient').value,
      diagnosis: $('#recDiagnosis').value,
      bp: $('#recBp').value,
      pulse: $('#recPulse').value,
      notes: $('#recNotes').value,
    };
    try {
      const res = await api('/api/medical-records', { method: 'POST', body });
      toast(res.message);
      render();
    } catch (err) { toast(err.message); }
  });

  // Book Appointment form (Patient Portal)
  $('#bookApptForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      clinician: $('#bookDoctor').value,
      time: $('#bookTime').value,
      reason: $('#bookReason').value,
    };
    try {
      let res;
      try {
        res = await api('/api/appointments/mine', { method: 'POST', body });
      } catch (err) {
        if (err.status === 404) {
          res = await api('/api/appointments', { method: 'POST', body });
        } else {
          throw err;
        }
      }
      toast(res.message || 'Appointment booked successfully!');
      render();
    } catch (err) { toast(err.message); }
  });

  // Patient Portal: File Insurance Claim
  $$('.btn-file-claim').forEach(btn => {
    btn.addEventListener('click', async () => {
      const amount = Number(btn.dataset.amount) || 135.00;
      const payer = prompt('Select your Health Insurance Provider (e.g. Medibank, Medicare, Bupa, HCF, NIB):', 'Medibank');
      if (!payer) return;
      try {
        const res = await api('/api/claims', {
          method: 'POST',
          body: { patient: state.user.name, payer, amount, procedureCode: 'GP-01' }
        });
        toast(res.message || 'Insurance claim filed successfully! Reception will verify your policy.');
        render();
      } catch (err) { toast(err.message); }
    });
  });

  // Patient Portal: Pay Copay Balance
  $$('.btn-pay-copay').forEach(btn => {
    btn.addEventListener('click', async () => {
      const invId = btn.dataset.invId;
      const copay = Number(btn.dataset.copay) || 45.00;
      try {
        const res = await api('/api/billing/payments', {
          method: 'POST',
          body: { invoiceId: invId, patientName: state.user.name, amount: copay, method: 'Credit Card (EFTPOS)' }
        });
        toast(res.message || 'Copay payment recorded successfully!');
        render();
      } catch (err) { toast(err.message); }
    });
  });

  // Advance Workflow Step
  $$('.btn-advance-workflow').forEach(btn => {
    btn.addEventListener('click', async () => {
      const caseId = btn.dataset.id;
      const step = Number(btn.dataset.step);
      try {
        const res = await api('/api/workflow/advance', { method: 'POST', body: { caseId, step } });
        toast(res.msg);
        render();
      } catch (err) { toast(err.message); }
    });
  });

  // Admin Settings form
  $('#settingsForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      clinicName: $('#cfgName').value,
      sessionTimeoutMinutes: $('#cfgTimeout').value,
      maxFailedLogins: $('#cfgMaxLogins').value,
      mfaRequired: $('#cfgMfa').checked,
    };
    try {
      await api('/api/admin/settings', { method: 'POST', body });
      toast('Settings saved.');
    } catch (err) { toast(err.message); }
  });

  // Reveal MRN / Policy listeners
  if (route === 'patients' || route === 'dashboard') {
    $$('[data-reveal]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.reveal;
        const password = window.prompt('Re-enter your password to view full MRN (logged server-side):');
        if (!password) { toast('Reveal cancelled.'); return; }
        try {
          const data = await api(`/api/patients/${id}/reveal`, { method: 'POST', body: { password } });
          btn.parentElement.innerHTML = `MRN-${data.id}`;
          if (state.user.role === 'clinician') refreshAudit();
        } catch (e) { toast(e.message); }
      });
    });
  }

  if (route === 'insurance') {
    $$('[data-reveal-policy]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const patient = btn.dataset.revealPolicy;
        const password = window.prompt('Re-enter your password to view full policy number (logged server-side):');
        if (!password) { toast('Reveal cancelled.'); return; }
        try {
          const data = await api('/api/insurance/reveal', { method: 'POST', body: { patient, password } });
          btn.parentElement.innerHTML = escapeHtml(data.policy);
          if (state.user.role === 'clinician') refreshAudit();
        } catch (e) { toast(e.message); }
      });
    });

    $$('.btn-verify-insurance').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const patient = btn.dataset.patient;
        try {
          await api('/api/insurance/update-status', { method: 'POST', body: { patient, status: 'Verified' } });
          toast(`Insurance coverage for "${patient}" verified.`);
          if (state.user.role === 'clinician') refreshAudit();
          render();
        } catch (err) { toast(err.message); }
      });
    });
  }

  if (route === 'discharge') {
    function applyPreset(p) {
      $('#dxComplaint').value = p.complaint || '';
      $('#dxFindings').value = p.findings || '';
      $('#dxTherapy').value = p.therapy || '';
      $('#dxRecs').value = p.recommendations || '';
      $('#dxLabResults').value = p.labResults || '';
    }

    $('#dxPatient')?.addEventListener('change', (e) => {
      if (!e.target.value) return;
      applyPreset(PRESETS.bronchitis);
      toast(`Auto-filled 5-field discharge summary template for ${e.target.value}`);
    });

    $$('.btn-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = PRESETS[btn.dataset.preset];
        if (p) {
          applyPreset(p);
          toast(`Preset applied to all 5 fields.`);
        }
      });
    });

    $('.btn-preset-clear')?.addEventListener('click', () => {
      $('#dischargeForm')?.reset();
      toast('Discharge summary cleared.');
    });

    $('#dischargeForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const body = {
        patientName: $('#dxPatient').value,
        chiefComplaint: $('#dxComplaint').value,
        findings: $('#dxFindings').value,
        therapy: $('#dxTherapy').value,
        recommendations: $('#dxRecs').value,
        labResults: $('#dxLabResults').value,
      };
      try {
        await api('/api/discharge-summaries', { method: 'POST', body });
        toast('Discharge summary saved and signed off.');
        e.target.reset();
        if (state.user.role === 'clinician') refreshAudit();
      } catch (err) { toast(err.message); }
    });
  }

  if (route === 'messages' || route === 'mymessages') {
    const btnId = route === 'messages' ? '#btnSendMsg' : '#btnPatSendMsg';
    const inputId = route === 'messages' ? '#msgReply' : '#patMsgReply';

    $(btnId)?.addEventListener('click', async () => {
      const val = $(inputId).value.trim();
      if (!val) { toast('Write a message before sending.'); return; }
      const thread = $('[data-thread]') ? $('[data-thread]').dataset.thread : state.user.name;
      const to = route === 'messages' ? thread : 'Dr. Osei';
      try {
        await api('/api/messages', { method: 'POST', body: { thread, to, text: val } });
        toast('Message sent securely.');
        render();
      } catch (e) { toast(e.message); }
    });
  }

  if (route === 'reports') {
    $$('.btn-generate-report').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          const analytics = await api('/api/reports/analytics');
          toast(`Generated ${btn.dataset.reportTitle}`);
          $('#reportContainer').innerHTML = `
            <div class="card" style="margin-top:18px;">
              <h3>${escapeHtml(btn.dataset.reportTitle)}</h3>
              <p>Total Revenue: ${money(analytics.totalRevenue)} · Receivables: ${money(analytics.outstanding)}</p>
            </div>`;
        } catch (e) { toast(e.message); }
      });
    });
  }
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', async () => {
  initLogin();
  try {
    const data = await api('/api/auth/me');
    state.user = data.user;
    enterApp();
  } catch {
    showLoginScreen();
  }
});
