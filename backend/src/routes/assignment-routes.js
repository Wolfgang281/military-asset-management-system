import { Router } from "express";
import { AssignmentController } from "../controllers/index.js";
import { AuthMiddleware } from "../middlewares/index.js";

const assignmentRouter = Router();

//! ─── GET /api/assignments ─────────────────────────────────────────────────────
assignmentRouter.get(
  "/",
  AuthMiddleware.authorize(["admin", "base_commander", "logistics"]),
  AssignmentController.getAssignments,
);

//! ─── POST /api/assignments ────────────────────────────────────────────────────
assignmentRouter.post(
  "/",
  AuthMiddleware.authorize(["admin", "base_commander"]),
  AssignmentController.createAssignment,
);

//! ─── PATCH /api/assignments/:id/expend ───────────────────────────────────────
assignmentRouter.patch(
  "/:id/expend",
  AuthMiddleware.authorize(["admin", "base_commander"]),
  AssignmentController.expendAsset,
);

//! ─── PATCH /api/assignments/:id/return ───────────────────────────────────────
assignmentRouter.patch(
  "/:id/return",
  AuthMiddleware.authorize(["admin", "base_commander"]),
  AssignmentController.returnAsset,
);

export default assignmentRouter;
