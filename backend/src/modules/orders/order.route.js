import express from 'express';
import * as orderController from "./order.controller.js";
import { orderShcema } from './order.shcema.js';
import { validateZod } from '../../middlewares/validate-zod.js';

const router = express.Router();

router.post('/create', validateZod(orderShcema), orderController.create)
router.get('/getorders', orderController.getOrders)
router.delete('/deleteorder/:orderId', orderController.deleteOrder)
router.get('/:orderId', orderController.getOrder);
router.get('/getCustomerOrder/:orderId', orderController.getOrderCustomer);




export default router;