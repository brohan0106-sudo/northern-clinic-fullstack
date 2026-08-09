const fs = require('fs');
const path = require('path');
const db = require('./db');
const { buildSeedData } = require('./seedData');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'clinic-data.json');

let memCache = buildSeedData();

// Connect to MongoDB and load persistent collections if present
db.connectDB().then(async (connected) => {
  if (connected && db.getIsConnected()) {
    try {
      const [
        users, patients, doctors, departments, appointments,
        medicalRecords, prescriptions, insuranceCompanies, insurancePolicies,
        claims, invoices, payments, billingStatements, messages, auditLog, dischargeSummaries
      ] = await Promise.all([
        db.User.find({}).lean(), db.Patient.find({}).lean(), db.Doctor.find({}).lean(),
        db.Department.find({}).lean(), db.Appointment.find({}).lean(), db.MedicalRecord.find({}).lean(),
        db.Prescription.find({}).lean(), db.InsuranceCompany.find({}).lean(), db.InsurancePolicy.find({}).lean(),
        db.Claim.find({}).lean(), db.Invoice.find({}).lean(), db.Payment.find({}).lean(),
        db.BillingStatement.find({}).lean(), db.Message.find({}).lean(), db.AuditLog.find({}).lean(),
        db.DischargeSummary.find({}).lean()
      ]);

      if (users && users.length > 0) memCache.users = users;
      if (patients && patients.length > 0) memCache.patients = patients;
      if (doctors && doctors.length > 0) memCache.doctors = doctors;
      if (departments && departments.length > 0) memCache.departments = departments;
      if (appointments && appointments.length > 0) memCache.appointments = appointments;
      if (medicalRecords && medicalRecords.length > 0) memCache.medicalRecords = medicalRecords;
      if (prescriptions && prescriptions.length > 0) memCache.prescriptions = prescriptions;
      if (insuranceCompanies && insuranceCompanies.length > 0) memCache.insuranceCompanies = insuranceCompanies;
      if (insurancePolicies && insurancePolicies.length > 0) {
        memCache.insurancePolicies = insurancePolicies;
        memCache.insurance = insurancePolicies;
      }
      if (claims && claims.length > 0) memCache.claims = claims;
      if (invoices && invoices.length > 0) memCache.invoices = invoices;
      if (payments && payments.length > 0) memCache.payments = payments;
      if (billingStatements && billingStatements.length > 0) memCache.billingStatements = billingStatements;
      if (messages && messages.length > 0) memCache.messages = messages;
      if (auditLog && auditLog.length > 0) memCache.auditLog = auditLog;
      if (dischargeSummaries && dischargeSummaries.length > 0) memCache.dischargeSummaries = dischargeSummaries;
      console.log('Loaded active MongoDB Atlas data into memory store.');
    } catch (e) {
      console.warn('MongoDB Atlas load note:', e.message);
    }
  }
}).catch(() => {});

function ensureFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) { /* serverless read-only filesystem */ }
  if (!fs.existsSync(DATA_FILE)) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(memCache, null, 2));
    } catch (e) { /* serverless read-only filesystem */ }
  }
}

function readAll() {
  ensureFile();
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const fileData = JSON.parse(raw);
      // Merge memory cache if it has newer MongoDB Atlas entries
      memCache = { ...fileData, ...memCache };
      return memCache;
    }
  } catch (e) { /* ignore read error */ }
  return memCache;
}

let writeQueue = Promise.resolve();
function writeAll(data) {
  memCache = data;
  writeQueue = writeQueue.then(async () => {
    const content = JSON.stringify(data, null, 2);
    try {
      fs.writeFileSync(DATA_FILE, content);
    } catch (err) {
      // Serverless environment: filesystem is read-only, MongoDB Atlas handles persistence.
    }

    if (db.getIsConnected()) {
      try {
        if (data.users) await db.User.deleteMany({}).then(() => db.User.insertMany(data.users));
        if (data.patients) await db.Patient.deleteMany({}).then(() => db.Patient.insertMany(data.patients));
        if (data.doctors) await db.Doctor.deleteMany({}).then(() => db.Doctor.insertMany(data.doctors));
        if (data.departments) await db.Department.deleteMany({}).then(() => db.Department.insertMany(data.departments));
        if (data.appointments) await db.Appointment.deleteMany({}).then(() => db.Appointment.insertMany(data.appointments));
        if (data.medicalRecords) await db.MedicalRecord.deleteMany({}).then(() => db.MedicalRecord.insertMany(data.medicalRecords));
        if (data.prescriptions) await db.Prescription.deleteMany({}).then(() => db.Prescription.insertMany(data.prescriptions));
        if (data.insuranceCompanies) await db.InsuranceCompany.deleteMany({}).then(() => db.InsuranceCompany.insertMany(data.insuranceCompanies));
        if (data.insurance || data.insurancePolicies) {
          const pols = data.insurance || data.insurancePolicies;
          await db.InsurancePolicy.deleteMany({}).then(() => db.InsurancePolicy.insertMany(pols));
        }
        if (data.claims) await db.Claim.deleteMany({}).then(() => db.Claim.insertMany(data.claims));
        if (data.invoices) await db.Invoice.deleteMany({}).then(() => db.Invoice.insertMany(data.invoices));
        if (data.payments) await db.Payment.deleteMany({}).then(() => db.Payment.insertMany(data.payments));
        if (data.billingStatements) await db.BillingStatement.deleteMany({}).then(() => db.BillingStatement.insertMany(data.billingStatements));
        if (data.messages) await db.Message.deleteMany({}).then(() => db.Message.insertMany(data.messages));
        if (data.auditLog) await db.AuditLog.deleteMany({}).then(() => db.AuditLog.insertMany(data.auditLog));
        if (data.dischargeSummaries) await db.DischargeSummary.deleteMany({}).then(() => db.DischargeSummary.insertMany(data.dischargeSummaries));
      } catch (e) {
        // Fallback file persistence succeeded
      }
    }
  });
  return writeQueue;
}

async function update(mutator) {
  const data = readAll();
  const result = mutator(data);
  await writeAll(data);
  return result;
}

async function initFromSeed(seedData) {
  const connected = await db.connectDB();
  if (connected && db.getIsConnected()) {
    try {
      const existingPatients = await db.Patient.find({}).lean();
      if (existingPatients && existingPatients.length > 0) {
        console.log('MongoDB Atlas already contains persistent patient records — preserving live database.');
        return;
      }
      if (seedData.users) await db.User.insertMany(seedData.users);
      if (seedData.patients) await db.Patient.insertMany(seedData.patients);
      if (seedData.doctors) await db.Doctor.insertMany(seedData.doctors);
      if (seedData.departments) await db.Department.insertMany(seedData.departments);
      if (seedData.appointments) await db.Appointment.insertMany(seedData.appointments);
      if (seedData.medicalRecords) await db.MedicalRecord.insertMany(seedData.medicalRecords);
      if (seedData.prescriptions) await db.Prescription.insertMany(seedData.prescriptions);
      if (seedData.insuranceCompanies) await db.InsuranceCompany.insertMany(seedData.insuranceCompanies);
      if (seedData.insurancePolicies) await db.InsurancePolicy.insertMany(seedData.insurancePolicies);
      if (seedData.claims) await db.Claim.insertMany(seedData.claims);
      if (seedData.invoices) await db.Invoice.insertMany(seedData.invoices);
      if (seedData.payments) await db.Payment.insertMany(seedData.payments);
      if (seedData.billingStatements) await db.BillingStatement.insertMany(seedData.billingStatements);
      if (seedData.messages) await db.Message.insertMany(seedData.messages);
      if (seedData.auditLog) await db.AuditLog.insertMany(seedData.auditLog);
      if (seedData.dischargeSummaries) await db.DischargeSummary.insertMany(seedData.dischargeSummaries);
      console.log('Synchronized MongoDB Atlas collections with initial seed data.');
    } catch (err) {
      console.warn('MongoDB sync note:', err.message);
    }
  }
}

module.exports = { readAll, writeAll, update, initFromSeed, DATA_FILE };
