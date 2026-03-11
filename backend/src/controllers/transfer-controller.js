import { AuditLogModel, TransferModel } from "../models/index.js";
import { AppError } from "../utils/index.js";

const getIP = (req) =>
  req.headers["x-forwarded-for"]?.split(",")[0] || req.ip || "unknown";

// Admin + Logistics: all transfers
// Base Commander: transfers where fromBase OR toBase === assignedBase
export const getTransfers = async (req, res, next) => {
  try {
    const { base, category, status, startDate, endDate } = req.query;

    const match = {};

    // RBAC scoping
    if (req.user.role === "base_commander") {
      match.$or = [
        { fromBase: req.user.assignedBase },
        { toBase: req.user.assignedBase },
      ];
    } else if (base) {
      match.$or = [{ fromBase: base }, { toBase: base }];
    }

    if (status) match.status = status;

    if (startDate || endDate) {
      match.transferDate = {};
      if (startDate) match.transferDate.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        match.transferDate.$lte = end;
      }
    }

    const transfers = await TransferModel.find(match)
      .populate("asset", "name category unit")
      .populate("authorizedBy", "name role")
      .sort({ transferDate: -1, createdAt: -1 });

    // Optional category filter (post-populate)
    const result = category
      ? transfers.filter((t) => t.asset?.category === category)
      : transfers;

    return res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: any transfer
// Base Commander: only from their assigned base
// Logistics: any transfer
export const createTransfer = async (req, res, next) => {
  try {
    const { asset, fromBase, toBase, quantity, transferDate, notes } = req.body;

    // Base commander can only transfer FROM their base
    if (
      req.user.role === "base_commander" &&
      fromBase !== req.user.assignedBase
    ) {
      return next(
        new AppError(
          "You can only initiate transfers from your assigned base",
          403,
        ),
      );
    }

    const transfer = await TransferModel.create({
      asset,
      fromBase,
      toBase,
      quantity,
      transferDate: transferDate || new Date(),
      status: "pending",
      authorizedBy: req.user._id,
      notes,
    });

    await transfer.populate("asset", "name category unit");
    await transfer.populate("authorizedBy", "name role");

    await AuditLogModel.create({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: "CREATE_TRANSFER",
      resource: "Transfer",
      resourceId: transfer._id,
      detail: `Transfer of ${quantity} x ${transfer.asset?.name} from ${fromBase} to ${toBase}`,
      ipAddress: getIP(req),
      method: "POST",
      endpoint: "/api/transfers",
      statusCode: 201,
      timestamp: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Transfer created successfully",
      data: transfer,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: any status update
// Logistics: any status update
// Base Commander: blocked
export const updateTransferStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const VALID = ["pending", "in_transit", "completed"];

    if (!status || !VALID.includes(status)) {
      return next(
        new AppError(`Status must be one of: ${VALID.join(", ")}`, 400),
      );
    }

    const transfer = await TransferModel.findById(req.params.id)
      .populate("asset", "name category unit")
      .populate("authorizedBy", "name role");

    if (!transfer) return next(new AppError("Transfer not found", 404));

    // Prevent going backwards: completed → pending/in_transit not allowed
    const ORDER = { pending: 0, in_transit: 1, completed: 2 };
    if (ORDER[status] < ORDER[transfer.status]) {
      return next(
        new AppError(
          `Cannot revert status from "${transfer.status}" to "${status}"`,
          400,
        ),
      );
    }

    const prevStatus = transfer.status;
    transfer.status = status;
    await transfer.save();

    await AuditLogModel.create({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: "UPDATE_TRANSFER_STATUS",
      resource: "Transfer",
      resourceId: transfer._id,
      detail: `Transfer status updated: ${prevStatus} → ${status} (${transfer.asset?.name})`,
      ipAddress: getIP(req),
      method: "PATCH",
      endpoint: `/api/transfers/${req.params.id}/status`,
      statusCode: 200,
      timestamp: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Transfer status updated",
      data: transfer,
    });
  } catch (error) {
    next(error);
  }
};

export const getTransferById = async (req, res, next) => {
  try {
    const transfer = await TransferModel.findById(req.params.id)
      .populate("asset", "name category unit")
      .populate("authorizedBy", "name role");

    if (!transfer) return next(new AppError("Transfer not found", 404));

    // Base commander can only see transfers involving their base
    if (
      req.user.role === "base_commander" &&
      transfer.fromBase !== req.user.assignedBase &&
      transfer.toBase !== req.user.assignedBase
    ) {
      return next(new AppError("Access denied", 403));
    }

    return res.status(200).json({ success: true, data: transfer });
  } catch (error) {
    next(error);
  }
};
