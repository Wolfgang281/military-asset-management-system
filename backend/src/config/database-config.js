import mongoose from "mongoose";
import { ENV_VAR } from "./index.js";

const connectDB = async () => {
  await mongoose.connect(ENV_VAR.MONGODB_ATLAS);
  console.log("MongoDB connected");
};

export default connectDB;
