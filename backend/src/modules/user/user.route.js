import express from 'express';
import * as userController from "./user.controller.js";
import { verifyToken } from '../../utils/verifyUser.js';

const router = express.Router();

router.put('/update/:userId', userController.updateUser);
router.delete('/delete/:userId', userController.deleteUser);
router.post('/signout', userController.signout);
router.get('/getusers', userController.getUsers);
router.get('/:userId', userController.getUser);


export default router;