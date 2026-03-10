import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { BASES, ROLES } from "../constants/constants.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    passwordHash: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password hash too short"],
      select: false,
    },

    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: ROLES,
        message: "Role must be admin, base_commander, or logistics",
      },
    },

    assignedBase: {
      type: String,
      enum: {
        values: [...BASES, null],
        message: `Base must be one of: ${BASES.join(", ")}`,
      },
      default: null,
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

userSchema.index({ role: 1 });
userSchema.index({ assignedBase: 1 });

userSchema.pre("validate", function () {
  if (this.role === "base_commander" && !this.assignedBase) {
    this.invalidate(
      "assignedBase",
      "Base Commander must have an assigned base",
    );
  }
  if (this.role !== "base_commander" && this.assignedBase) {
    this.assignedBase = null;
  }
});

userSchema.pre("save", async function () {
  if (!this.isModified("passwordHash")) return;
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
