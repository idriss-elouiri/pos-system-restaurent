import express from "express";
import * as customerController from "./customer.controller.js";
import { validateZod } from "../../middlewares/validate-zod.js";
import { loginCustomerShcema, registerCustomerShcema } from "./customer.shcema.js";
import { verifyToken } from "../../utils/verifyUser.js";

const router = express.Router();

router.post(
  "/registerCustomer",
  validateZod(registerCustomerShcema),
  customerController.registerCustomerHandler
);
router.post("/loginCustomer", validateZod(loginCustomerShcema), customerController.loginCustomerHandler);
router.put('/updateCustomer/:CustomerId', verifyToken, customerController.updateCustomer);
router.delete('/deleteCustomer/:CustomerId', verifyToken, customerController.deleteCustomer);
router.post('/signoutCustomer', customerController.signoutCustomer);
router.get('/getCustomers', verifyToken, customerController.getCustomers);
router.get('/:CustomerId', customerController.getCustomer);

export default router;