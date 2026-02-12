// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// PORTS
export const PORT = Number(process.env.PORT) || 6001;
export const HTTP_PORT = Number(process.env.HTTP_PORT) || 6005;
export const HTTPS_PORT = Number(process.env.HTTPS_PORT) || 6003;

// AUTH
export const JWT_SECRET = process.env.JWT_SECRET;

// DATABASE
export const DATABASE_URL = process.env.DATABASE_URL;

// PASSWORD HASHING
export const BCRYPT_SALT_ROUNDS =
  Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

// OTP EXPIRY
export const OTP_TTL_MINUTES =
  Number(process.env.OTP_TTL_MINUTES) || 10;

// SMTP EMAIL CONFIG
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_PASS = process.env.SMTP_PASS;
export const SMTP_SERVICE =
  process.env.SMTP_SERVICE || "gmail";

  // ENVIRONMENT
export const NODE_ENV = process.env.NODE_ENV || "production";
