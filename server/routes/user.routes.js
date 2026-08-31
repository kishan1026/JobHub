// routes/user.routes.js

import express from "express";
import {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser
} from "../controllers/user.controller.js";

import verifyJWT from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get(
    "/current-user",
    verifyJWT,
    getCurrentUser
);
router.post("/logout", verifyJWT, logoutUser);

export default router;