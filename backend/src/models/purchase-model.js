import mongoose from "mongoose";
import { BASES } from "../constants/constants.js";

const purchaseSchema = new mongoose.Schema(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: [true, "Asset is required"],
    },

    base: {
      type: String,
      required: [true, "Base is required"],
      enum: {
        values: BASES,
        message: `Base must be one of: ${BASES.join(", ")}`,
      },
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be a whole number",
      },
    },

    purchaseDate: {
      type: Date,
      required: [true, "Purchase date is required"],
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "Purchase date cannot be in the future",
      },
    },

    supplierRef: {
      type: String,
      trim: true,
      maxlength: [100, "Supplier reference cannot exceed 100 characters"],
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Created by user is required"],
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

purchaseSchema.index({ base: 1 });
purchaseSchema.index({ asset: 1 });
purchaseSchema.index({ purchaseDate: -1 });
purchaseSchema.index({ base: 1, purchaseDate: -1 });
purchaseSchema.index({ base: 1, asset: 1, purchaseDate: -1 });

const Purchase = mongoose.model("Purchase", purchaseSchema);

export default Purchase;
