import express from 'express';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();
router.get('/profile', protect, (req, res) => {
    res.json({
        message : "Protected data access granted",
        userId : req.user.id
    });
});
export default router;