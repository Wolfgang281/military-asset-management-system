import { AssetModel } from "../models/index.js";
import { AppError } from "../utils/index.js";

export const getAssets = async (req, res, next) => {
  try {
    const { category } = req.query;

    const filter = { isActive: true };
    if (category) filter.category = category;

    const assets = await AssetModel.find(filter).sort({ category: 1, name: 1 });

    return res.status(200).json({
      success: true,
      count: assets.length,
      data: assets,
    });
  } catch (error) {
    next(error);
  }
};

export const getAssetById = async (req, res, next) => {
  try {
    const asset = await AssetModel.findById(req.params.id);

    if (!asset) {
      return next(new AppError("Asset not found", 404));
    }

    return res.status(200).json({
      success: true,
      data: asset,
    });
  } catch (error) {
    next(error);
  }
};
