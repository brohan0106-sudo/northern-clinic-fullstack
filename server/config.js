require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-secret-change-me';

if (NODE_ENV === 'production' && JWT_SECRET === 'dev-only-secret-change-me') {
  throw new Error('Refusing to start: set a real JWT_SECRET before running with NODE_ENV=production.');
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://brohan0106_db_user:Clinic%232026@northernclinic01.hb21qmr.mongodb.net/northern_clinic?appName=NorthernClinic01';

module.exports = {
  NODE_ENV,
  PORT: parseInt(process.env.PORT, 10) || 3000,
  JWT_SECRET,
  MONGODB_URI,
  SESSION_TIMEOUT_MINUTES: parseInt(process.env.SESSION_TIMEOUT_MINUTES, 10) || 15,
  MFA_CODE_TTL_MINUTES: parseInt(process.env.MFA_CODE_TTL_MINUTES, 10) || 5,
  IS_PROD: NODE_ENV === 'production',
};
