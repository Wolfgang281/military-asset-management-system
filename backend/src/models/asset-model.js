import mongoose from "mongoose";
import { CATEGORIES, UNITS } from "../constants/constants.js";

const assetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Asset name is required"],
      trim: true,
      unique: true,
      minlength: [2, "Asset name must be at least 2 characters"],
      maxlength: [100, "Asset name cannot exceed 100 characters"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: CATEGORIES,
        message: `Category must be one of: ${CATEGORIES.join(", ")}`,
      },
    },

    unit: {
      type: String,
      required: [true, "Unit is required"],
      enum: {
        values: UNITS,
        message: `Unit must be one of: ${UNITS.join(", ")}`,
      },
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

assetSchema.index({ category: 1 });

const Asset = mongoose.model("Asset", assetSchema);

export default Asset;
