// routes/application.routes.js

import express from "express";

import {
    applyForJob,
    getMyApplications,
    getJobApplicants,
    updateApplicationStatus,
    getRecruiterApplicationStats
} from "../controllers/application.controller.js";

import verifyJWT from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = express.Router();

// Job seeker applies for a job
router.post(
    "/:jobId",
    verifyJWT,
    authorizeRoles("jobseeker"),
    applyForJob
);

// Job seeker views their applications
router.get(
    "/my-applications",
    verifyJWT,
    authorizeRoles("jobseeker"),
    getMyApplications
);

// Recruiter views applicants for their job
router.get(
    "/job/:jobId",
    verifyJWT,
    authorizeRoles("recruiter", "admin"),
    getJobApplicants
);

// Recruiter updates application status
router.patch(
    "/:applicationId/status",
    verifyJWT,
    authorizeRoles("recruiter", "admin"),
    updateApplicationStatus
);

router.get(
    "/recruiter/stats",
    verifyJWT,
    authorizeRoles("recruiter", "admin"),
    getRecruiterApplicationStats
);

export default router;