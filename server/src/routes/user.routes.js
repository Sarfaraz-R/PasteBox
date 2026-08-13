
import { Router } from "express";
const router=Router();
import { getUsers, getUserById, registerUser, loginUser, updateUser, deleteUser, logoutUser, refreshSession, getCurrentUser, googleAuthStart, googleAuthCallback } from "../controllers/user.controller.js";
import authenticate from "../middlewares/auth.middlewares.js";

router.get("/user", authenticate, getUsers);
router.get("/user/:userId", authenticate, getUserById);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/signup", registerUser);
router.post("/logout", logoutUser);
router.get('/logout',logoutUser);
router.post("/refresh", refreshSession);
router.get("/google", googleAuthStart);
router.get("/google/callback", googleAuthCallback);
router.get("/me", authenticate, getCurrentUser);
router.put("/user/:userId", authenticate, updateUser);
router.delete("/user/:userId", authenticate, deleteUser);

export default router;
