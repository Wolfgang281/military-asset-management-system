import { AssetModel, AuditLogModel, PurchaseModel } from "../models/index.js";
import { AppError } from "../utils/index.js";

const getIP = (req) =>
  req.headers["x-forwarded-for"]?.split(",")[0] || req.ip || "unknown";

//! ─── GET /api/purchases ───────────────────────────────────────────────────────
// Access: Admin, Base Commander (scoped), Logistics
export const getPurchases = async (req, res, next) => {
  try {
    const { startDate, endDate, category, base } = req.query;

    // ── Base scoping ──────────────────────────────────────────────────────────
    const resolvedBase =
      req.user.role === "base_commander" ? req.user.assignedBase : base || null;

    // ── Build match filter ────────────────────────────────────────────────────
    const match = {};
    if (resolvedBase) match.base = resolvedBase;
    if (startDate || endDate) {
      match.purchaseDate = {};
      if (startDate) match.purchaseDate.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        match.purchaseDate.$lte = end;
      }
    }

    // ── Aggregation with asset + user populate ────────────────────────────────
    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: "assets",
          localField: "asset",
          foreignField: "_id",
          as: "assetInfo",
        },
      },
      { $unwind: "$assetInfo" },
      // category filter after join
      ...(category ? [{ $match: { "assetInfo.category": category } }] : []),
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdByInfo",
        },
      },
      { $unwind: { path: "$createdByInfo", preserveNullAndEmpty: true } },
      {
        $project: {
          _id: 1,
          base: 1,
          quantity: 1,
          purchaseDate: 1,
          supplierRef: 1,
          notes: 1,
          createdAt: 1,
          asset: {
            _id: "$assetInfo._id",
            name: "$assetInfo.name",
            category: "$assetInfo.category",
            unit: "$assetInfo.unit",
          },
          createdBy: {
            _id: "$createdByInfo._id",
            name: "$createdByInfo.name",
            role: "$createdByInfo.role",
          },
        },
      },
      { $sort: { purchaseDate: -1 } },
    ];

    const purchases = await PurchaseModel.aggregate(pipeline);

    return res.status(200).json({
      success: true,
      count: purchases.length,
      data: purchases,
    });
  } catch (error) {
    next(error);
  }
};

//! ─── POST /api/purchases ──────────────────────────────────────────────────────
// Access: Admin, Logistics only
export const createPurchase = async (req, res, next) => {
  try {
    const { asset, base, quantity, purchaseDate, supplierRef, notes } =
      req.body;

    // ── Validate asset exists ─────────────────────────────────────────────────
    const assetDoc = await AssetModel.findById(asset);
    if (!assetDoc) {
      return next(new AppError("Asset not found", 404));
    }

    // ── Base commander cannot create purchases (enforced at route level too) ──
    // but double-check here for safety
    if (req.user.role === "base_commander") {
      return next(new AppError("Base commanders cannot record purchases", 403));
    }

    const purchase = await PurchaseModel.create({
      asset,
      base,
      quantity,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
      supplierRef: supplierRef || "",
      notes: notes || "",
      createdBy: req.user._id,
    });

    // ── Populate for response ─────────────────────────────────────────────────
    const populated = await PurchaseModel.findById(purchase._id)
      .populate("asset", "name category unit")
      .populate("createdBy", "name role");

    // ── Audit log ─────────────────────────────────────────────────────────────
    await AuditLogModel.create({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: "CREATE_PURCHASE",
      resource: "Purchase",
      resourceId: purchase._id,
      detail: `Purchased ${quantity}x ${assetDoc.name} for ${base} — ${supplierRef || "no ref"}`,
      ipAddress: getIP(req),
      method: "POST",
      endpoint: "/api/purchases",
      statusCode: 201,
      timestamp: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Purchase recorded successfully",
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

//! ─── DELETE /api/purchases/:id ────────────────────────────────────────────────
// Access: Admin only
export const deletePurchase = async (req, res, next) => {
  try {
    const purchase = await PurchaseModel.findById(req.params.id).populate(
      "asset",
      "name",
    );

    if (!purchase) {
      return next(new AppError("Purchase record not found", 404));
    }

    await PurchaseModel.findByIdAndDelete(req.params.id);

    // ── Audit log ─────────────────────────────────────────────────────────────
    await AuditLogModel.create({
      userId: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      action: "DELETE_PURCHASE",
      resource: "Purchase",
      resourceId: purchase._id,
      detail: `Deleted purchase of ${purchase.quantity}x ${purchase.asset?.name} from ${purchase.base}`,
      ipAddress: getIP(req),
      method: "DELETE",
      endpoint: `/api/purchases/${req.params.id}`,
      statusCode: 200,
      timestamp: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Purchase record deleted",
    });
  } catch (error) {
    next(error);
  }
};
