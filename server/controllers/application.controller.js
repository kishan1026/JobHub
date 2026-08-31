import Application from "../models/Application.model.js";
import Job from "../models/Job.model.js";
import Profile from "../models/Profile.model.js";
import matchResumeToJob from "../services/jobMatch.service.js";
// Apply to a job
const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { coverLetter } = req.body;

        // 1. Check logged-in user role
        if (req.user.role !== "jobseeker") {
            return res.status(403).json({
                message: "Only job seekers can apply for jobs",
            });
        }

        // 2. Find job
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        // 3. Check job status
        if (job.status !== "active") {
            return res.status(400).json({
                message: "This job is no longer accepting applications",
            });
        }

        // 4. Check duplicate application
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: req.user._id,
        });

        if (existingApplication) {
            return res.status(409).json({
                message: "You have already applied for this job",
            });
        }

        // 5. Get candidate profile
        const profile = await Profile.findOne({
            user: req.user._id,
        });

        if (!profile) {
            return res.status(400).json({
                message: "Please complete your profile before applying",
            });
        }

        // 6. Check AI resume analysis
        if (!profile.resumeAnalysis) {
            return res.status(400).json({
                message: "Please upload and analyze your resume first",
            });
        }

        // 7. AI matching
        console.log("🤖 Matching resume with job...");

        const aiMatch = await matchResumeToJob(
            profile.resumeAnalysis,
            job
        );

        // 8. Create application
        const application = await Application.create({
            job: jobId,
            applicant: req.user._id,
            resume: profile.resume,
            coverLetter: coverLetter?.trim(),
            aiMatch,
        });

        // 9. Response
        return res.status(201).json({
            message: "Application submitted successfully",
            application,
        });

    } catch (error) {
        console.error(
            "Apply Job Error:",
            error.message
        );

        return res.status(500).json({
            message: "Failed to apply for job",
        });
    }
};


// Get current user's applications
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({
            applicant: req.user._id,
        })
            .populate(
                "job",
                "title company location jobType salary status"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: applications.length,
            applications,
        });
    } catch (error) {
        console.error("Get My Applications Error:", error.message);

        return res.status(500).json({
            message: "Failed to fetch applications",
        });
    }
};

// Recruiter gets applicants for their job
const getJobApplicants = async (req, res) => {
    try {
        const { jobId } = req.params;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        // Only job owner can see applicants
        if (job.recruiter.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not allowed to view these applicants",
            });
        }

        const applications = await Application.find({
            job: jobId,
        })
            .populate(
                "applicant",
                "username email"
            )
            .populate(
                "job",
                "title company"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: applications.length,
            applications,
        });
    } catch (error) {
        console.error("Get Applicants Error:", error.message);

        return res.status(500).json({
            message: "Failed to fetch applicants",
        });
    }
};

// Recruiter updates application status
const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "applied",
            "under-review",
            "shortlisted",
            "interview",
            "selected",
            "rejected",
        ];

        // Validate status
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid application status",
            });
        }

        const application = await Application.findById(
            applicationId
        ).populate("job");

        if (!application) {
            return res.status(404).json({
                message: "Application not found",
            });
        }

        // Only the recruiter who owns the job can update status
        if (
            application.job.recruiter.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message:
                    "You are not allowed to update this application",
            });
        }

        application.status = status;

        await application.save();

        return res.status(200).json({
            message: "Application status updated successfully",
            application,
        });
    } catch (error) {
        console.error(
            "Update Application Status Error:",
            error.message
        );

        return res.status(500).json({
            message: "Failed to update application status",
        });
    }
};
const getRecruiterApplicationStats = async (req, res) => {
    try {
        const jobs = await Job.find({
            recruiter: req.user._id,
        }).select("_id");

        const jobIds = jobs.map((job) => job._id);

        const stats = await Application.aggregate([
            {
                $match: {
                    job: { $in: jobIds },
                },
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        const result = {
            total: 0,
            applied: 0,
            "under-review": 0,
            shortlisted: 0,
            interview: 0,
            selected: 0,
            rejected: 0,
        };

        stats.forEach((item) => {
            result[item._id] = item.count;
            result.total += item.count;
        });

        return res.status(200).json({
            message: "Application statistics fetched successfully",
            stats: result,
        });
    } catch (error) {
        console.error(
            "Recruiter Stats Error:",
            error.message
        );

        return res.status(500).json({
            message: "Failed to fetch application statistics",
        });
    }
};

export {
    applyForJob,
    getMyApplications,
    getJobApplicants,
    updateApplicationStatus,
    getRecruiterApplicationStats
};