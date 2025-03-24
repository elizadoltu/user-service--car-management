import express from 'express';
import { authMiddleware, authorizeadmin } from '../middleware/authMiddleware.js';
import { getAllUsers, getUserById, updateUserById, deleteUserById } from '../controllers/admin.controller.js';

const adminRouter = express.Router();
adminRouter.use(authMiddleware, authorizeadmin);

adminRouter.get('/admin/users', getAllUsers);
adminRouter.get('/admin/users/:userId', getUserById);
adminRouter.put('/users/:userId', updateUserById);
adminRouter.delete('/users/:userId', deleteUserById);

export default adminRouter;