import express from "express";

import {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    getMyJobs,
} from "../controllers/job.controller.js";

import verifyJWT from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllJobs);
router.get(
    "/my-jobs",
    verifyJWT,
    authorizeRoles("recruiter", "admin"),
    getMyJobs
);
router.get("/:id", getJobById);

// Recruiter/Admin routes
router.post(
    "/",
    verifyJWT,
    authorizeRoles("recruiter", "admin"),
    createJob
);

router.put(
    "/:id",
    verifyJWT,
    authorizeRoles("recruiter", "admin"),
    updateJob
);

router.delete(
    "/:id",
    verifyJWT,
    authorizeRoles("recruiter", "admin"),
    deleteJob
);

export default router;