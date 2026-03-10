import mongoose from "mongoose";
import { BASES, TRANSFER_STATUSES } from "../constants/constants.js";

const transferSchema = new mongoose.Schema(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: [true, "Asset is required"],
    },

    fromBase: {
      type: String,
      required: [true, "Source base is required"],
      enum: {
        values: BASES,
        message: `From base must be one of: ${BASES.join(", ")}`,
      },
    },

    toBase: {
      type: String,
      required: [true, "Destination base is required"],
      enum: {
        values: BASES,
        message: `To base must be one of: ${BASES.join(", ")}`,
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

    transferDate: {
      type: Date,
      required: [true, "Transfer date is required"],
    },

    status: {
      type: String,
      enum: {
        values: TRANSFER_STATUSES,
        message: `Status must be one of: ${TRANSFER_STATUSES.join(", ")}`,
      },
      default: "pending",
    },

    authorizedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Authorizing user is required"],
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

transferSchema.pre("validate", function (next) {
  if (this.fromBase && this.toBase && this.fromBase === this.toBase) {
    this.invalidate("toBase", "Source and destination base cannot be the same");
  }
  //   next();
});

transferSchema.index({ fromBase: 1 });
transferSchema.index({ toBase: 1 });
transferSchema.index({ status: 1 });
transferSchema.index({ asset: 1 });
transferSchema.index({ transferDate: -1 });
transferSchema.index({ fromBase: 1, status: 1, transferDate: -1 });
transferSchema.index({ toBase: 1, status: 1, transferDate: -1 });

const Transfer = mongoose.model("Transfer", transferSchema);

export default Transfer;
