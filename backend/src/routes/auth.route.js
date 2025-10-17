import express from "express";
import { register, login, logout, updateProfile } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

// use the rate limiting 
router.use(arcjetProtection);

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.put('/update-profile', protectedRoute, updateProfile);

// Route to check if user is authenticated
router.get('/check', protectedRoute, (req, res) => {
    res.status(200).json(req.user);
});

export default router;