// payment.routes.js

import express from 'express';
import {  getPaymentCustomer, getPayments, processPayment } from './payment.controller.js';

const router = express.Router();

// POST route to process payment
router.post('/processPayment', processPayment);
router.get('/get', getPayments);
router.get('/getPaymentCts/:customerId', getPaymentCustomer);
export default router;
