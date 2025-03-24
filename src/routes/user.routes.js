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

userRouter.get('/profile', authMiddleware, getUserProfile);
userRouter.put('/profile', authMiddleware, updateUserProfile);
userRouter.delete('/profile', authMiddleware, deleteUserProfile);

export default userRouter;