import { Router } from "express";
import { AssetController } from "../controllers/index.js";

const assetRouter = Router();

assetRouter.get("/", AssetController.getAssets);
assetRouter.get("/:id", AssetController.getAssetById);

export default assetRouter;

/* 
GET http://localhost:9000/api/asset
GET http://localhost:9000/api/asset?category=weapons
GET http://localhost:9000/api/asset?category=vehicles
GET http://localhost:9000/api/asset?category=ammunition
GET http://localhost:9000/api/asset?category=equipment
GET http://localhost:9000/api/asset/<ASSET_ID>
GET http://localhost:9000/api/asset/000000000000000000000000
*/
