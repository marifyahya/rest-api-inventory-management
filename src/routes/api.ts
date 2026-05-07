import { Router } from "express";
import * as productController from "../controllers/product.controller";
import { validate } from "../middlewares/validate.middleware";
import { createProductSchema } from "../schemas/product.schema";
import * as authController from "../controllers/auth.controller";
import { roleMiddleware } from "../middlewares/role.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const protectedRouter = Router();
const adminRouter = Router();

adminRouter.use(authMiddleware, roleMiddleware(["ADMIN"]));
protectedRouter.use(authMiddleware);

router.post("/auth/login", authController.login);

adminRouter.post("/auth/register", authController.register);

protectedRouter.get("/products", productController.index);
protectedRouter.get("/products/:id", productController.show);
protectedRouter.post("/products", validate(createProductSchema as any), productController.store);
protectedRouter.put("/products/:id", validate(createProductSchema as any), productController.update);
protectedRouter.delete("/products/:id", productController.destroy);

router.use(adminRouter);
router.use(protectedRouter);

export default router;
