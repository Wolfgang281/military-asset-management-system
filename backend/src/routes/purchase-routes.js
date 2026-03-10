import { Router } from "express";
import { PurchaseController } from "../controllers/index.js";
import { AuthMiddleware } from "../middlewares/index.js";

const purchaseRouter = Router();

// Admin, Base Commander (scoped in controller), Logistics
purchaseRouter.get(
  "/",
  AuthMiddleware.authorize(["admin", "base_commander", "logistics"]),
  PurchaseController.getPurchases,
);

// Admin, Logistics only
purchaseRouter.post(
  "/",
  AuthMiddleware.authorize(["admin", "logistics"]),
  PurchaseController.createPurchase,
);

// Admin only
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
Content-Type: application/json
{"asset":"<ASSET_ID>","base":"Northern Command - Udhampur","quantity":50,"purchaseDate":"2025-03-01","supplierRef":"OFB-2025-099","notes":"Test purchase"}

POST {{BASE_URL}}/api/purchases
Content-Type: application/json
{"asset":"<ASSET_ID>","base":"Forward Ops - Siachen","quantity":10,"purchaseDate":"2025-03-01"}

POST {{BASE_URL}}/api/purchases
Content-Type: application/json
{"asset":"<ASSET_ID>","base":"Invalid Base","quantity":10,"purchaseDate":"2025-03-01"}

POST {{BASE_URL}}/api/purchases
Content-Type: application/json
{"asset":"<ASSET_ID>","base":"Northern Command - Udhampur","quantity":10,"purchaseDate":"2099-01-01"}

DELETE {{BASE_URL}}/api/purchases/<PURCHASE_ID>

DELETE {{BASE_URL}}/api/purchases/000000000000000000000000
*/
