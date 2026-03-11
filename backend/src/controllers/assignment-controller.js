import { AssignmentModel, AuditLogModel } from "../models/index.js";
import { AppError } from "../utils/index.js";

const getIP = (req) =>
  req.headers["x-forwarded-for"]?.split(",")[0] || req.ip || "unknown";

//! ─── GET /api/assignments ─────────────────────────────────────────────────────
// Admin + Logistics: all assignments
// Base Commander: only their base
export const getAssignments = async (req, res, next) => {
  try {
    const { base, category, status, startDate, endDate } = req.query;

    const match = {};

    // RBAC scoping
    if (req.user.role === "base_commander") {
      match.base = req.user.assignedBase;
    } else if (base) {
      match.base = base;
    }

    if (status) match.status = status;

    if (startDate || endDate) {
      match.assignedDate = {};
      if (startDate) match.assignedDate.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        match.assignedDate.$lte = end;
      }
    }

    const assignments = await AssignmentModel.find(match)
      .populate("asset", "name category unit")
      .populate("assignedBy", "name role")
      .sort({ assignedDate: -1, createdAt: -1 });

    // Optional category filter (post-populate)
    const result = category
      ? assignments.filter((a) => a.asset?.category === category)
      : assignments;

    return res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

//! ─── POST /api/assignments ────────────────────────────────────────────────────
// Admin: any base
// Base Commander: only their assigned base
// Logistics: blocked
export const createAssignment = async (req, res, next) => {
  try {
    const {
      asset,
      base,
      personnelName,
      personnelId,
      serialNumber,
      quantity,
      assignedDate,
      notes,
    } = req.body;

    // Base commander can only assign within their base
    if (req.user.role === "base_commander" && base !== req.user.assignedBase) {
      return next(
        new AppError(
          "You can only create assignments for your assigned base",
          403,
        ),
      );
    }

    const assignment = await AssignmentModel.create({
      asset,
      base,
      personnelName,
      personnelId,
      serialNumber: serialNumber || null,
      quantity,
      assignedDate: assignedDate || new Date(),
      status: "active",
      assignedBy: req.user._id,
      notes,
    });

    await assignment.populate("asset", "name category unit");
    await assignment.populate("assignedBy", "name role");

    await AuditLogModel.create({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: "CREATE_ASSIGNMENT",
      resource: "Assignment",
      resourceId: assignment._id,
      detail: `${quantity} x ${assignment.asset?.name} assigned to ${personnelName} (${personnelId}) at ${base}`,
      ipAddress: getIP(req),
      method: "POST",
      endpoint: "/api/assignments",
      statusCode: 201,
      timestamp: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

//! ─── PATCH /api/assignments/:id/expend ───────────────────────────────────────
// Admin + Base Commander (own base only)
export const expendAsset = async (req, res, next) => {
  try {
    const assignment = await AssignmentModel.findById(req.params.id)
      .populate("asset", "name category unit")
      .populate("assignedBy", "name role");

    if (!assignment) return next(new AppError("Assignment not found", 404));

    if (assignment.status !== "active") {
      return next(
        new AppError(
          `Cannot expend an assignment with status "${assignment.status}"`,
          400,
        ),
      );
    }

    // Base commander can only expend from their base
    if (
      req.user.role === "base_commander" &&
      assignment.base !== req.user.assignedBase
    ) {
      return next(new AppError("Access denied", 403));
    }

    assignment.status = "expended";
    assignment.expendedDate = new Date();
    await assignment.save();

    await AuditLogModel.create({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: "EXPEND_ASSET",
      resource: "Assignment",
      resourceId: assignment._id,
      detail: `${assignment.quantity} x ${assignment.asset?.name} expended (assigned to ${assignment.personnelName})`,
      ipAddress: getIP(req),
      method: "PATCH",
      endpoint: `/api/assignments/${req.params.id}/expend`,
      statusCode: 200,
      timestamp: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Asset marked as expended",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

//! ─── PATCH /api/assignments/:id/return ───────────────────────────────────────
// Admin + Base Commander (own base only)
export const returnAsset = async (req, res, next) => {
  try {
    const assignment = await AssignmentModel.findById(req.params.id)
      .populate("asset", "name category unit")
      .populate("assignedBy", "name role");

    if (!assignment) return next(new AppError("Assignment not found", 404));

    if (assignment.status !== "active") {
      return next(
        new AppError(
          `Cannot return an assignment with status "${assignment.status}"`,
          400,
        ),
      );
    }

    // Base commander can only return from their base
    if (
      req.user.role === "base_commander" &&
      assignment.base !== req.user.assignedBase
    ) {
      return next(new AppError("Access denied", 403));
    }

    assignment.status = "returned";
    await assignment.save();

    await AuditLogModel.create({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: "RETURN_ASSET",
      resource: "Assignment",
      resourceId: assignment._id,
      detail: `${assignment.quantity} x ${assignment.asset?.name} returned by ${assignment.personnelName} (${assignment.personnelId})`,
      ipAddress: getIP(req),
      method: "PATCH",
      endpoint: `/api/assignments/${req.params.id}/return`,
      statusCode: 200,
      timestamp: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Asset marked as returned",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};
