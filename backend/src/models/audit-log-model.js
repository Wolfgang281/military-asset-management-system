import mongoose from "mongoose";
import { ACTIONS } from "../constants/constants.js";

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  userName: {
    type: String,
    required: true,
    trim: true,
  },

  userRole: {
    type: String,
    required: true,
    enum: ["admin", "base_commander", "logistics"],
  },

  action: {
    type: String,
    required: true,
    enum: {
      values: ACTIONS,
      message: `Action must be one of: ${ACTIONS.join(", ")}`,
    },
  },

  resource: {
    type: String,
    required: true,
    enum: ["Auth", "Purchase", "Transfer", "Assignment", "User"],
  },

  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },

  detail: {
    type: String,
    required: true,
    trim: true,
    maxlength: [500, "Detail cannot exceed 500 characters"],
  },

  ipAddress: {
    type: String,
    required: true,
    trim: true,
  },

  method: {
    type: String,
    required: true,
    enum: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  },

  endpoint: {
    type: String,
    required: true,
    trim: true,
  },

  statusCode: {
    type: Number,
    required: true,
    min: 100,
    max: 599,
  },

  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ resource: 1 });
auditLogSchema.index({ resourceId: 1 });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;
