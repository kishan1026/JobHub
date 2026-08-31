import express from "express";
import upload from "../middleware/upload.middleware.js";

import {
    getMyProfile,
    updateProfile,
    uploadResume,
    testResumeParser,
    analyzeResumeWithAI,
} from "../controllers/profile.controller.js";

import verifyJWT from "../middleware/auth.middleware.js";

const router = express.Router();

// Get logged-in user's profile
router.get(
    "/me",
    verifyJWT,
    getMyProfile
);

// Create/update logged-in user's profile
router.put(
    "/me",
    verifyJWT,
    updateProfile
);

router.post(
    "/resume",
    verifyJWT,
    upload.single("resume"),
    uploadResume
);

router.post(
    "/resume/test-parser",
    verifyJWT,
    upload.single("resume"),
    testResumeParser
);

router.post(
    "/resume/analyze",
    verifyJWT,
    upload.single("resume"),
    analyzeResumeWithAI
);

export default router;