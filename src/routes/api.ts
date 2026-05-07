import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";

import { createUserSchema } from "../schemas/user.schema";
import { createProductSchema } from "../schemas/product.schema";

import * as authController from "../controllers/auth.controller";
import * as userController from "../controllers/user.controller";
import * as productController from "../controllers/product.controller";

const router = Router();
const protectedRouter = Router();
const adminRouter = Router();

adminRouter.use(authMiddleware, roleMiddleware(["ADMIN"]));
protectedRouter.use(authMiddleware);

router.post("/auth/login", authController.login);

adminRouter.post("/users", validate(createUserSchema as any), userController.store);

protectedRouter.get("/products", productController.index);
protectedRouter.get("/products/:id", productController.show);
protectedRouter.post("/products", validate(createProductSchema as any), productController.store);
protectedRouter.put("/products/:id", validate(createProductSchema as any), productController.update);
protectedRouter.delete("/products/:id", productController.destroy);

router.use("/admin", adminRouter);
router.use(protectedRouter);

export default router;
