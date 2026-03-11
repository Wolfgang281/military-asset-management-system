import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { ENV_VAR } from "./config/index.js";
import { error } from "./middlewares/index.js";
import seed from "./seed/seeder.js";

import router from "./routes/index.js";

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: ENV_VAR.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", router);

app.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    message: "The server is running! Time to make some magic happen ✨",
  });
});

if (process.argv[2] == "seed") {
  seed();
}

app.use(error);

export default app;
