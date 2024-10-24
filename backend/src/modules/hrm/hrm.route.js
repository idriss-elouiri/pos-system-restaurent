import express from "express";
import * as hrmController from "./hrm.controller.js";
import { validateZod } from "../../middlewares/validate-zod.js";
import { loginStaffShcema, registerStaffShcema } from "./hrm.shcema.js";

const router = express.Router();

router.post(
  "/registerStaff",
  validateZod(registerStaffShcema),
  hrmController.registerStaffHandler
);
router.post("/loginStaff", validateZod(loginStaffShcema), hrmController.loginStaffHandler);
router.put('/updateStaff/:staffId', hrmController.updateStaff);
router.delete('/deleteStaff/:staffId', hrmController.deleteStaff);
router.post('/signoutStaff', hrmController.signoutStaff);
router.get('/getStaffs', hrmController.getStaffs);
router.get('/:staffId', hrmController.getStaff);

export default router;