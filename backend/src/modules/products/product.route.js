import express from 'express';
import * as productController from "./product.controller.js";
import { productShcema } from './product.shcema.js';
import { validateZod } from '../../middlewares/validate-zod.js';

const router = express.Router();

router.post('/create', validateZod(productShcema), productController.createProduct)
router.get('/getproducts', productController.getProducts)
router.delete('/deleteproduct/:productId', productController.deleteProduct)
router.put('/updateproduct/:productId', productController.updateProduct)
router.get('/:productId', productController.getProduct);




export default router;