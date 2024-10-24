import express from "express";
import * as customerController from "./customer.controller.js";
import { validateZod } from "../../middlewares/validate-zod.js";
import { loginCustomerShcema, registerCustomerShcema } from "./customer.shcema.js";

const router = express.Router();

router.post(
  "/registerCustomer",
  validateZod(registerCustomerShcema),
  customerController.registerCustomerHandler
);
router.post("/loginCustomer", validateZod(loginCustomerShcema), customerController.loginCustomerHandler);
router.put('/updateCustomer/:CustomerId', customerController.updateCustomer);
router.delete('/deleteCustomer/:CustomerId', customerController.deleteCustomer);
router.post('/signoutCustomer', customerController.signoutCustomer);
router.get('/getCustomers', customerController.getCustomers);
router.get('/:CustomerId', customerController.getCustomer);

export default router;