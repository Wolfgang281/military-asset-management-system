import { Router } from "express";
import { AuthMiddleware } from "../middlewares/index.js";
import authRouter from "./auth-routes.js";
import dashboardRouter from "./dashboard-routes.js";
import purchaseRouter from "./purchase-routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/dashboard", AuthMiddleware.authenticate, dashboardRouter);
router.use("/purchase", AuthMiddleware.authenticate, purchaseRouter);

export default router;
