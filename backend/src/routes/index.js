import { Router } from "express";
import { AuthMiddleware } from "../middlewares/index.js";
import assetRouter from "./asset-route.js";
import assignmentRouter from "./assignment-routes.js";
import authRouter from "./auth-routes.js";
import dashboardRouter from "./dashboard-routes.js";
import purchaseRouter from "./purchase-routes.js";
import transferRouter from "./transfer-route.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/dashboard", AuthMiddleware.authenticate, dashboardRouter);
router.use("/purchase", AuthMiddleware.authenticate, purchaseRouter);
router.use("/asset", AuthMiddleware.authenticate, assetRouter);
router.use("/transfer", AuthMiddleware.authenticate, transferRouter);
router.use("/assignment", AuthMiddleware.authenticate, assignmentRouter);

export default router;
