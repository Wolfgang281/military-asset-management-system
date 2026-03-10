import dotenv from "dotenv";
dotenv.config({ quiet: true });

export const ENV_VAR = {
  PORT: process.env.PORT,
  MONGODB_ATLAS: process.env.MONGODB_ATLAS,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  FRONTEND_URL: process.env.FRONTEND_URL,
};

export { default as connectDB } from "./database-config.js";
