import jwt from "jsonwebtoken";
import { ENV_VAR } from "../config/index.js";
import { UserModel } from "../models/index.js";
import { AppError } from "../utils/index.js";

export const authenticate = async (req, res, next) => {
  try {
    let token = req?.cookies?.token;
    if (!token)
      return next(new AppError("Authentication required. Please login.", 401));

    let decodedToken = jwt.verify(token, ENV_VAR.JWT_SECRET);
    // console.log("decodedToken: ", decodedToken);
    let user = await UserModel.findById(decodedToken.id);
    if (!user)
      return next(new AppError("Invalid Session. Please login again.", 401));
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Access denied. Required roles: ${allowedRoles.join(", ")}`,
    });
  }
  next();
};
