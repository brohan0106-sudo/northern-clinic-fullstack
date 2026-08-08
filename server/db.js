const mongoose = require('mongoose');
const { MONGODB_URI } = require('./config');

let isConnected = false;

// Connection options
const options = {
  serverSelectionTimeoutMS: 5000,
};

async function connectDB() {
  if (isConnected) return true;
  try {
    await mongoose.connect(MONGODB_URI, options);
    isConnected = true;
    console.log(`Connected to MongoDB at ${MONGODB_URI}`);
    return true;
  } catch (err) {
    console.warn(`MongoDB connection offline (${err.message}). Defaulting to store persistence.`);
    isConnected = false;
    return false;
  }
}

function getIsConnected() {
  return isConnected;
}

// Schemas & Models
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  initials: { type: String },
  failedLogins: { type: Number, default: 0 },
  lockedUntil: { type: Date, default: null },
}, { timestamps: true });

const patientSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dob: { type: String, required: true },
  phone: { type: String },
  allergies: { type: String },
  lastVisit: { type: String },
  flag: { type: String, default: 'none' },
  insurancePayer: { type: String },
  policyNumber: { type: String },
  emergencyContact: { type: String },
}, { timestamps: true });

const doctorSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  department: { type: String, required: true },
  fee: { type: Number, default: 150 },
  availableDays: { type: String },
  slots: [String],
  bio: { type: String },
}, { timestamps: true });

const departmentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  head: { type: String, required: true },
  phone: { type: String },
  floor: { type: String },
}, { timestamps: true });

const appointmentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  time: { type: String, required: true },
  patient: { type: String, required: true },
  clinician: { type: String, required: true },
  type: { type: String },
  status: { type: String, default: 'Scheduled' },
  department: { type: String },
  date: { type: String },
}, { timestamps: true });

const medicalRecordSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  patientName: { type: String, required: true },
  doctorName: { type: String, required: true },
  diagnosis: { type: String, required: true },
  bp: { type: String },
  pulse: { type: Number },
  notes: { type: String },
  date: { type: String },
}, { timestamps: true });

const prescriptionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  patientName: { type: String, required: true },
  doctorName: { type: String, required: true },
  medication: { type: String, required: true },
  dosage: { type: String, required: true },
  duration: { type: String },
  status: { type: String, default: 'Active' },
  refillsLeft: { type: Number, default: 3 },
  issuedDate: { type: String },
}, { timestamps: true });

const insuranceCompanySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  payerCode: { type: String },
  phone: { type: String },
  supportEmail: { type: String },
  verificationPortal: { type: String },
}, { timestamps: true });

const insurancePolicySchema = new mongoose.Schema({
  policyId: { type: String, required: true, unique: true },
  patient: { type: String, required: true },
  payer: { type: String, required: true },
  policyNumber: { type: String, required: true },
  tier: { type: String },
  copay: { type: Number, default: 0 },
  expiryDate: { type: String },
  status: { type: String, default: 'Verified' },
}, { timestamps: true });

const claimSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  patient: { type: String, required: true },
  payer: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'Submitted' },
  date: { type: String },
  procedureCode: { type: String },
}, { timestamps: true });

const invoiceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  patientName: { type: String, required: true },
  date: { type: String },
  items: [{ desc: String, fee: Number }],
  subtotal: { type: Number, required: true },
  insurerReimbursement: { type: Number },
  patientCoPay: { type: Number },
  status: { type: String, default: 'Issued' },
}, { timestamps: true });

const paymentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  invoiceId: { type: String },
  patientName: { type: String, required: true },
  amount: { type: Number, required: true },
  method: { type: String },
  receiptRef: { type: String },
  date: { type: String },
}, { timestamps: true });

const billingStatementSchema = new mongoose.Schema({
  statementId: { type: String, required: true, unique: true },
  patientName: { type: String, required: true },
  period: { type: String },
  totalBilled: { type: Number },
  insurancePaid: { type: Number },
  patientPaid: { type: Number },
  balanceDue: { type: Number },
  status: { type: String },
}, { timestamps: true });

const messageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  thread: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  text: { type: String, required: true },
  ts: { type: Number, default: Date.now },
}, { timestamps: true });

const auditLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  ts: { type: Number, default: Date.now },
  actor: { type: String, required: true },
  role: { type: String, required: true },
  type: { type: String, required: true },
  action: { type: String, required: true },
}, { timestamps: true });

const dischargeSummarySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  patientName: { type: String, required: true },
  clinician: { type: String, required: true },
  chiefComplaint: { type: String, required: true },
  findings: { type: String, required: true },
  therapy: { type: String, required: true },
  recommendations: { type: String, required: true },
  labResults: { type: String, required: true },
  ts: { type: Number, default: Date.now },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema);
const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);
const Department = mongoose.models.Department || mongoose.model('Department', departmentSchema);
const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
const MedicalRecord = mongoose.models.MedicalRecord || mongoose.model('MedicalRecord', medicalRecordSchema);
const Prescription = mongoose.models.Prescription || mongoose.model('Prescription', prescriptionSchema);
const InsuranceCompany = mongoose.models.InsuranceCompany || mongoose.model('InsuranceCompany', insuranceCompanySchema);
const InsurancePolicy = mongoose.models.InsurancePolicy || mongoose.model('InsurancePolicy', insurancePolicySchema);
const Claim = mongoose.models.Claim || mongoose.model('Claim', claimSchema);
const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);
const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
const BillingStatement = mongoose.models.BillingStatement || mongoose.model('BillingStatement', billingStatementSchema);
const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
const DischargeSummary = mongoose.models.DischargeSummary || mongoose.model('DischargeSummary', dischargeSummarySchema);

module.exports = {
  connectDB,
  getIsConnected,
  User, Patient, Doctor, Department, Appointment, MedicalRecord, Prescription,
  InsuranceCompany, InsurancePolicy, Claim, Invoice, Payment, BillingStatement,
  Message, AuditLog, DischargeSummary,
};
