import { Router } from "express";
import { PurchaseController } from "../controllers/index.js";
import { AuthMiddleware } from "../middlewares/index.js";

const purchaseRouter = Router();

purchaseRouter.get(
  "/",
  AuthMiddleware.authorize(["admin", "base_commander", "logistics"]),
  PurchaseController.getPurchases,
);

purchaseRouter.post(
  "/",
  AuthMiddleware.authorize(["admin", "logistics"]),
  PurchaseController.createPurchase,
);

purchaseRouter.delete(
  "/:id",
  AuthMiddleware.authorize(["admin"]),
  PurchaseController.deletePurchase,
);

export default purchaseRouter;

/* 
GET {{BASE_URL}}/api/purchases

GET {{BASE_URL}}/api/purchases?base=Northern Command - Udhampur

GET {{BASE_URL}}/api/purchases?category=weapons

GET {{BASE_URL}}/api/purchases?startDate=2025-01-01&endDate=2025-01-31

GET {{BASE_URL}}/api/purchases?base=Western Command - Chandimandir&category=weapons&startDate=2025-01-01&endDate=2025-01-31

POST {{BASE_URL}}/api/purchases


POST {{BASE_URL}}/api/purchases

POST {{BASE_URL}}/api/purchases


POST {{BASE_URL}}/api/purchases

DELETE {{BASE_URL}}/api/purchases/<PURCHASE_ID>
*/
