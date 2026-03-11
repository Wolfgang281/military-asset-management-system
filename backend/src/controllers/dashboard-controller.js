import {
  AssignmentModel,
  PurchaseModel,
  TransferModel,
} from "../models/index.js";

export const getDashboard = async (req, res, next) => {
  try {
    const { startDate, endDate, base, category } = req.query;

    // base_commander is always locked to their assigned base
    const resolvedBase =
      req.user.role === "base_commander" ? req.user.assignedBase : base || null;

    const start = startDate ? new Date(startDate) : new Date("2000-01-01");
    const end = endDate ? new Date(endDate) : new Date();
    // set end to end of day
    end.setHours(23, 59, 59, 999);

    // We'll use $lookup to join asset category where needed
    const assetMatchStage = category ? { "assetInfo.category": category } : {};

    const purchaseMatch = {
      purchaseDate: { $gte: start, $lte: end },
      ...(resolvedBase && { base: resolvedBase }),
    };

    const purchaseAgg = await PurchaseModel.aggregate([
      { $match: purchaseMatch },
      {
        $lookup: {
          from: "assets",
          localField: "asset",
          foreignField: "_id",
          as: "assetInfo",
        },
      },
      { $unwind: "$assetInfo" },
      ...(category ? [{ $match: { "assetInfo.category": category } }] : []),
      {
        $group: {
          _id: null,
          total: { $sum: "$quantity" },
          records: {
            $push: {
              _id: "$_id",
              asset: "$assetInfo.name",
              category: "$assetInfo.category",
              base: "$base",
              quantity: "$quantity",
              supplierRef: "$supplierRef",
              purchaseDate: "$purchaseDate",
            },
          },
        },
      },
    ]);

    const totalPurchases = purchaseAgg[0]?.total ?? 0;
    const purchaseRecords = purchaseAgg[0]?.records ?? [];

    const openingMatch = {
      purchaseDate: { $lt: start },
      ...(resolvedBase && { base: resolvedBase }),
    };

    const openingAgg = await PurchaseModel.aggregate([
      { $match: openingMatch },
      {
        $lookup: {
          from: "assets",
          localField: "asset",
          foreignField: "_id",
          as: "assetInfo",
        },
      },
      { $unwind: "$assetInfo" },
      ...(category ? [{ $match: { "assetInfo.category": category } }] : []),
      { $group: { _id: null, total: { $sum: "$quantity" } } },
    ]);

    const openingBalance = openingAgg[0]?.total ?? 0;

    const transferInMatch = {
      status: "completed",
      transferDate: { $gte: start, $lte: end },
      ...(resolvedBase && { toBase: resolvedBase }),
    };

    const transferInAgg = await TransferModel.aggregate([
      { $match: transferInMatch },
      {
        $lookup: {
          from: "assets",
          localField: "asset",
          foreignField: "_id",
          as: "assetInfo",
        },
      },
      { $unwind: "$assetInfo" },
      ...(category ? [{ $match: { "assetInfo.category": category } }] : []),
      {
        $group: {
          _id: null,
          total: { $sum: "$quantity" },
          records: {
            $push: {
              _id: "$_id",
              asset: "$assetInfo.name",
              category: "$assetInfo.category",
              fromBase: "$fromBase",
              toBase: "$toBase",
              quantity: "$quantity",
              transferDate: "$transferDate",
              status: "$status",
            },
          },
        },
      },
    ]);

    const totalTransfersIn = transferInAgg[0]?.total ?? 0;
    const transferInRecords = transferInAgg[0]?.records ?? [];

    const transferOutMatch = {
      status: "completed",
      transferDate: { $gte: start, $lte: end },
      ...(resolvedBase && { fromBase: resolvedBase }),
    };

    const transferOutAgg = await TransferModel.aggregate([
      { $match: transferOutMatch },
      {
        $lookup: {
          from: "assets",
          localField: "asset",
          foreignField: "_id",
          as: "assetInfo",
        },
      },
      { $unwind: "$assetInfo" },
      ...(category ? [{ $match: { "assetInfo.category": category } }] : []),
      {
        $group: {
          _id: null,
          total: { $sum: "$quantity" },
          records: {
            $push: {
              _id: "$_id",
              asset: "$assetInfo.name",
              category: "$assetInfo.category",
              fromBase: "$fromBase",
              toBase: "$toBase",
              quantity: "$quantity",
              transferDate: "$transferDate",
              status: "$status",
            },
          },
        },
      },
    ]);

    const totalTransfersOut = transferOutAgg[0]?.total ?? 0;
    const transferOutRecords = transferOutAgg[0]?.records ?? [];

    const assignmentMatch = {
      ...(resolvedBase && { base: resolvedBase }),
    };

    const assignmentAgg = await AssignmentModel.aggregate([
      { $match: assignmentMatch },
      {
        $lookup: {
          from: "assets",
          localField: "asset",
          foreignField: "_id",
          as: "assetInfo",
        },
      },
      { $unwind: "$assetInfo" },
      ...(category ? [{ $match: { "assetInfo.category": category } }] : []),
      {
        $group: {
          _id: "$status",
          total: { $sum: "$quantity" },
        },
      },
    ]);

    const assigned = assignmentAgg.find((a) => a._id === "active")?.total ?? 0;
    const expended =
      assignmentAgg.find((a) => a._id === "expended")?.total ?? 0;

    const netMovement = totalPurchases + totalTransfersIn - totalTransfersOut;
    const closingBalance = openingBalance + netMovement;

    return res.status(200).json({
      success: true,
      data: {
        openingBalance,
        closingBalance,
        netMovement,
        purchases: totalPurchases,
        transfersIn: totalTransfersIn,
        transfersOut: totalTransfersOut,
        assigned,
        expended,
        breakdown: {
          purchases: purchaseRecords,
          transfersIn: transferInRecords,
          transfersOut: transferOutRecords,
        },
        appliedFilters: {
          base: resolvedBase ?? "All Bases",
          category: category ?? "All Categories",
          startDate: start,
          endDate: end,
        },
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    next(error);
  }
};
