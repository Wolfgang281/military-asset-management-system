import { Router } from "express";
import { DashboardController } from "../controllers/index.js";

const dashboardRouter = Router();

dashboardRouter.get("/", DashboardController.getDashboard);

export default dashboardRouter;

/* 

# All bases, all time
GET {{BASE_URL}}/api/dashboard

# Filter by base + date range
GET {{BASE_URL}}/api/dashboard?base=Northern Command - Udhampur&startDate=2025-01-01&endDate=2025-02-28

# Filter by category
GET {{BASE_URL}}/api/dashboard?category=weapons

# Filter by base + category + date
GET {{BASE_URL}}/api/dashboard?base=Western Command - Chandimandir&category=ammunition&startDate=2025-01-01&endDate=2025-01-31
*/
