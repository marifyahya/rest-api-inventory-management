import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { validate } from '../middlewares/validate.middleware';
import { createProductSchema } from '../schemas/product.schema';

const router = Router();

router.get('/products', productController.index);
router.get('/products/:id', productController.show);
router.post('/products', validate(createProductSchema as any), productController.store);

export default router;
