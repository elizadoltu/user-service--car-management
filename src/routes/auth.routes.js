import express from 'express';
import { login, register } from "../controllers/auth.controller.js";
import { getUserProfile, updateUserProfile, deleteUserProfile } from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.post('/auth/login', login);
userRouter.post('/auth/register', register);

userRouter.get('/profile', getUserProfile);
userRouter.put('/profile', updateUserProfile);
userRouter.delete('/profile', deleteUserProfile);

export default userRouter;