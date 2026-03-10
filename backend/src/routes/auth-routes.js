import { Router } from "express";
import { AuthController } from "../controllers/index.js";
import { AuthMiddleware } from "../middlewares/index.js";

const authRouter = Router();

authRouter.post("/login", AuthController.login);
authRouter.post("/logout", AuthMiddleware.authenticate, AuthController.logout);
authRouter.get("/me", AuthMiddleware.authenticate, AuthController.getMe);

export default authRouter;
