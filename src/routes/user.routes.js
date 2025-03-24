import express from 'express';
import { getUserProfile, updateUserProfile, deleteUserProfile } from "../controllers/user.controller.js";
import { authMiddleware } from '../middleware/authMiddleware.js';

const userRouter = express.Router();
const authorizeClient = (req, res, next) => {
    if (req.user.role !== 'client') {
        return res.status(403).json({ message: 'Access restricted to clients only' });
    }
    next();
};

userRouter.get('/profile', authMiddleware, authorizeClient, getUserProfile);
userRouter.put('/profile', authMiddleware, authorizeClient, updateUserProfile);
userRouter.delete('/profile', authMiddleware, authorizeClient, deleteUserProfile);

export default userRouter;