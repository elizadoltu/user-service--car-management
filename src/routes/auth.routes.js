import express from 'express';
import { login, register, loginAdmin, registerAdmin } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post('/auth/login', login);
authRouter.post('/auth/register', register);
authRouter.post('/auth/login/admin', loginAdmin);
authRouter.post('/auth/register/admin', registerAdmin)

export default authRouter;