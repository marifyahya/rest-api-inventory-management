import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";

import { createUserSchema, loginUserSchema } from "../schemas/user.schema";
import { createProductSchema } from "../schemas/product.schema";
import { createCategorySchema, updateCategorySchema } from "../schemas/category.schema";
import { createSupplierSchema, updateSupplierSchema } from "../schemas/supplier.schema";
import { createStockTransactionSchema } from "../schemas/stock-transaction.schema";

import * as authController from "../controllers/auth.controller";
import * as userController from "../controllers/user.controller";
import * as productController from "../controllers/product.controller";
import * as categoryController from "../controllers/category.controller";
import * as supplierController from "../controllers/supplier.controller";
import * as stockTransactionController from "../controllers/stock-transaction.controller";
import * as reportController from "../controllers/report.controller";

const router = Router();
const protectedRouter = Router();
const adminRouter = Router();

adminRouter.use(authMiddleware, roleMiddleware(["ADMIN"]));
protectedRouter.use(authMiddleware);

router.post("/auth/login", validate(loginUserSchema as any), authController.login);

adminRouter.post("/users", validate(createUserSchema as any), userController.store);

protectedRouter.get("/categories", categoryController.index);
protectedRouter.get("/categories/:id", categoryController.show);
adminRouter.post("/categories", validate(createCategorySchema as any), categoryController.store);
adminRouter.put("/categories/:id", validate(updateCategorySchema as any), categoryController.update);
adminRouter.delete("/categories/:id", categoryController.destroy);

protectedRouter.get("/suppliers", supplierController.index);
protectedRouter.get("/suppliers/:id", supplierController.show);
adminRouter.post("/suppliers", validate(createSupplierSchema as any), supplierController.store);
adminRouter.put("/suppliers/:id", validate(updateSupplierSchema as any), supplierController.update);
adminRouter.delete("/suppliers/:id", supplierController.destroy);

protectedRouter.get("/auth/me", authController.me);
protectedRouter.get("/products", productController.index);
protectedRouter.get("/products/:id", productController.show);
protectedRouter.post("/products", validate(createProductSchema as any), productController.store);
protectedRouter.put("/products/:id", validate(createProductSchema as any), productController.update);
protectedRouter.delete("/products/:id", productController.destroy);

protectedRouter.get("/stock/transactions", stockTransactionController.index);
protectedRouter.get("/stock/transactions/:id", stockTransactionController.show);
protectedRouter.post("/stock/in", validate(createStockTransactionSchema as any), stockTransactionController.stockIn);
protectedRouter.post("/stock/out", validate(createStockTransactionSchema as any), stockTransactionController.stockOut);

protectedRouter.get("/reports", reportController.dashboard);
protectedRouter.get("/reports/low-stock", reportController.lowStock);
protectedRouter.get("/reports/stock-export", reportController.exportStock);
protectedRouter.get("/reports/transactions-export", reportController.exportTransactions);

router.use("/admin", adminRouter);
router.use(protectedRouter);

export default router;
