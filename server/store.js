const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const seedData = require('./seedData');

const MONGODB_URI = process.env.MONGODB_URI;
const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'clinic-data.json');

// Memory store initialized with default structure
let memCache = seedData();
let isInitialized = false;

// MongoDB Atlas optional Cloud persistence sync
let mongoDb = null;
if (MONGODB_URI) {
  const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  client.connect().then(() => {
    mongoDb = client.db('northern_clinic');
    console.log('Successfully connected to MongoDB Atlas Cloud Database!');
    return loadFromMongo();
  }).catch(err => {
    console.warn('MongoDB Atlas connection note (using resilient memory store):', err.message);
  });
}

async function loadFromMongo() {
  if (!mongoDb) return;
  try {
    const users = await mongoDb.collection('users').find().toArray();
    const patients = await mongoDb.collection('patients').find().toArray();
    const doctors = await mongoDb.collection('doctors').find().toArray();
    const departments = await mongoDb.collection('departments').find().toArray();
    const appointments = await mongoDb.collection('appointments').find().toArray();
    const medicalRecords = await mongoDb.collection('medicalRecords').find().toArray();
    const prescriptions = await mongoDb.collection('prescriptions').find().toArray();
    const insuranceCompanies = await mongoDb.collection('insuranceCompanies').find().toArray();
    const insurancePolicies = await mongoDb.collection('insurancePolicies').find().toArray();
    const claims = await mongoDb.collection('claims').find().toArray();
    const invoices = await mongoDb.collection('invoices').find().toArray();
    const payments = await mongoDb.collection('payments').find().toArray();
    const billingStatements = await mongoDb.collection('billingStatements').find().toArray();
    const messages = await mongoDb.collection('messages').find().toArray();
    const auditLog = await mongoDb.collection('auditLog').find().toArray();
    const dischargeSummaries = await mongoDb.collection('dischargeSummaries').find().toArray();

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
    isInitialized = true;
    console.log('Loaded active MongoDB Atlas data into memory store.');
  } catch (e) {
    console.warn('MongoDB Atlas load note:', e.message);
  }
}

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
  if (!isInitialized) {
    ensureFile();
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const fileData = JSON.parse(raw);
        if (fileData && typeof fileData === 'object') {
          // Persisted disk data takes absolute precedence over initial seed data!
          memCache = { ...memCache, ...fileData };
        }
      }
    } catch (e) { /* ignore read error */ }
    isInitialized = true;
  }
  return memCache;
}

let writeQueue = Promise.resolve();
function writeAll(data) {
  memCache = data;
  writeQueue = writeQueue.then(async () => {
    try {
      if (fs.existsSync(DATA_DIR)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      }
    } catch (e) { /* serverless read-only filesystem */ }

    if (mongoDb) {
      try {
        const collections = [
          'users', 'patients', 'doctors', 'departments', 'appointments',
          'medicalRecords', 'prescriptions', 'insuranceCompanies', 'insurancePolicies',
          'claims', 'invoices', 'payments', 'billingStatements', 'messages', 'auditLog', 'dischargeSummaries'
        ];
        for (const col of collections) {
          if (data[col] && Array.isArray(data[col])) {
            await mongoDb.collection(col).deleteMany({});
            if (data[col].length > 0) {
              await mongoDb.collection(col).insertMany(data[col]);
            }
          }
        }
      } catch (err) {
        console.warn('MongoDB Atlas async write error:', err.message);
      }
    }
  });
  return writeQueue;
}

async function update(mutator) {
  const data = readAll();
  const result = await mutator(data);
  await writeAll(data);
  return result;
}

module.exports = { readAll, writeAll, update };
