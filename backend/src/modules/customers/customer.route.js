import express from "express";
import * as customerController from "./customer.controller.js";
import { validateZod } from "../../middlewares/validate-zod.js";
import {  registerCustomerShcema } from "./customer.shcema.js";
import { verifyToken } from "../../utils/verifyUser.js";

const router = express.Router();

router.post(
  "/registerCustomer",
  validateZod(registerCustomerShcema),
  customerController.registerCustomerHandler
);
router.get('/getCustomers', verifyToken, customerController.getCustomers);
router.get('/:CustomerId', customerController.getCustomer);

export default router;