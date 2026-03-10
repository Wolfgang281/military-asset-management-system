import mongoose from "mongoose";
import { ASSIGNMENT_STATUSES, BASES } from "../constants/constants.js";

const assignmentSchema = new mongoose.Schema(
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

    personnelName: {
      type: String,
      required: [true, "Personnel name is required"],
      trim: true,
      minlength: [2, "Personnel name must be at least 2 characters"],
      maxlength: [100, "Personnel name cannot exceed 100 characters"],
    },

    personnelId: {
      type: String,
      required: [true, "Personnel service ID is required"],
      trim: true,
      maxlength: [50, "Personnel ID cannot exceed 50 characters"],
    },

    serialNumber: {
      type: String,
      trim: true,
      maxlength: [100, "Serial number cannot exceed 100 characters"],
      default: null,
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

    assignedDate: {
      type: Date,
      required: [true, "Assigned date is required"],
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "Assigned date cannot be in the future",
      },
    },

    status: {
      type: String,
      enum: {
        values: ASSIGNMENT_STATUSES,
        message: `Status must be one of: ${ASSIGNMENT_STATUSES.join(", ")}`,
      },
      default: "active",
    },

    expendedDate: {
      type: Date,
      default: null,
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Assigned by user is required"],
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

assignmentSchema.pre("validate", function (next) {
  if (this.expendedDate && this.status !== "expended") {
    this.invalidate(
      "expendedDate",
      "expendedDate can only be set when status is expended",
    );
  }
  if (this.status === "expended" && !this.expendedDate) {
    this.expendedDate = new Date(); // auto-fill if not provided
  }
  //   next();
});

assignmentSchema.index({ base: 1 });
assignmentSchema.index({ asset: 1 });
assignmentSchema.index({ status: 1 });
assignmentSchema.index({ personnelId: 1 });
assignmentSchema.index({ base: 1, status: 1 });

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
