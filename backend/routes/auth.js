import express from 'express';
import { Login, Signup, Logout, verifyEmail, resendVerificationEmail, forgotPassword, resetPassword, checkAuth } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const Router = express.Router();

Router.get("/check-auth", verifyToken, checkAuth);

Router.post('/signup', Signup);

Router.post('/login', Login)

Router.post('/logout', Logout);

Router.post('/verify-email', verifyEmail);

Router.post('/resend-email', resendVerificationEmail)

Router.post('/forgot-password', forgotPassword);

Router.post('/reset-password/:token', resetPassword);

export default Router;