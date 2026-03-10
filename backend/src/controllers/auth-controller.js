import { AuditLogModel, UserModel } from "../models/index.js";
import { AppError, generateToken } from "../utils/index.js";

const getIP = (req) =>
  req.headers["x-forwarded-for"]?.split(",")[0] || req.ip || "unknown";

//! ─── POST /api/auth/login ─────────────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({
      email: email.toLowerCase().trim(),
    }).select("+passwordHash");

    if (!user) {
      return next(new AppError("Invalid email or password", 401));
    }

    if (!user.isActive) {
      return next(
        new AppError("Account has been disabled. Contact your administrator."),
        403,
      );
    }

    const isMatch = await user.comparePassword(password);
    console.log("isMatch: ", isMatch);
    if (!isMatch) {
      return next(new AppError("Invalid email or password", 401));
    }

    const token = generateToken(user._id);

    await AuditLogModel.create({
      userId: user._id,
      userName: user.name,
      userRole: user.role,
      action: "LOGIN",
      resource: "Auth",
      resourceId: null,
      detail: `${user.name} (${user.role}) logged in`,
      ipAddress: getIP(req),
      method: "POST",
      endpoint: "/api/auth/login",
      statusCode: 200,
      timestamp: new Date(),
    });

    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      token,
      message: "Logged in Successfully",
      user: user.toSafeObject(),
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

//! ─── POST /api/auth/logout ─────────────────────────────────────────────────────
export const logout = async (req, res, next) => {
  res.clearCookie("token", {
    maxAge: 0,
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out Successfully",
  });
};

//! ─── POST /api/auth/me ─────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    if (!req.user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account has been disabled",
      });
    }

    return res.status(200).json({
      success: true,
      user: req.user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};
