import jwt from "jsonwebtoken";
import { ENV_VAR } from "../../config/index.js";

const generateToken = (id) => {
  return jwt.sign({ id }, ENV_VAR.JWT_SECRET, {
    expiresIn: ENV_VAR.JWT_EXPIRES_IN,
  });
};

export default generateToken;
