import { Router } from "express";
import * as productController from "../controllers/product.controller";
import { validate } from "../middlewares/validate.middleware";
import { createProductSchema } from "../schemas/product.schema";
import * as authController from "../controllers/auth.controller";

const router = Router();

router.post("/auth/login", authController.login);

router.get("/products", productController.index);
router.get("/products/:id", productController.show);
router.post("/products", validate(createProductSchema as any), productController.store);
router.put("/products/:id", validate(createProductSchema as any), productController.update);
router.delete("/products/:id", productController.destroy);

export default router;
