import { Router } from "express";
import { TransferController } from "../controllers/index.js";
import { AuthMiddleware } from "../middlewares/index.js";

const transferRouter = Router();

transferRouter.get(
  "/",
  AuthMiddleware.authorize(["admin", "base_commander", "logistics"]),
  TransferController.getTransfers,
);

transferRouter.post(
  "/",
  AuthMiddleware.authorize(["admin", "base_commander", "logistics"]),
  TransferController.createTransfer,
);

transferRouter.get(
  "/:id",
  AuthMiddleware.authorize(["admin", "base_commander", "logistics"]),
  TransferController.getTransferById,
);

transferRouter.patch(
  "/:id/status",
  AuthMiddleware.authorize(["admin", "logistics"]),
  TransferController.updateTransferStatus,
);

export default transferRouter;
