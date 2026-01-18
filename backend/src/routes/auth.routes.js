import express from 'express';
import { login, register ,refreshAccessToken ,logout ,me } from '../controllers/auth.controller.js';
import protect from '../middleware/auth.middleware.js';
import { loginRateLimiter } from '../middleware/rateLimit.middleware.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', loginRateLimiter, login);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);
router.get('/me', protect, me);

export default router;