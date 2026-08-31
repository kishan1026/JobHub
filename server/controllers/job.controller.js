import Job from "../models/Job.model.js";

// Create Job
const createJob = async (req, res) => {
    try {
        const {
            title,
            description,
            company,
            location,
            jobType,
            experience,
            salary,
            skills,
            responsibilities,
            requirements,
        } = req.body;

        // Validation
        if (
            !title?.trim() ||
            !description?.trim() ||
            !company?.trim() ||
            !location?.trim() ||
            !jobType
        ) {
            return res.status(400).json({
                message:
                    "Title, description, company, location and job type are required",
            });
        }

        const job = await Job.create({
            title: title.trim(),
            description: description.trim(),
            company: company.trim(),
            location: location.trim(),
            jobType,
            experience: experience?.trim(),
            salary,
            skills,
            responsibilities,
            requirements,

            // Never take recruiter ID from req.body
            recruiter: req.user._id,
        });

        return res.status(201).json({
            message: "Job created successfully",
            job,
        });
    } catch (error) {
        console.error("Create Job Error:", error.message);

        return res.status(500).json({
            message: "Failed to create job",
        });
    }
};

const getAllJobs = async (req, res) => {
    try {
        const {
            search,
            location,
            jobType,
            experience,
            minSalary,
            maxSalary,
            page = 1,
            limit = 10,
        } = req.query;

        // Build filter
        const filter = {
            status: "active",
        };

        // Search by title, company, description, or skills
        if (search?.trim()) {
            const searchRegex = new RegExp(search.trim(), "i");

            filter.$or = [
                { title: searchRegex },
                { company: searchRegex },
                { description: searchRegex },
                { skills: searchRegex },
            ];
        }

        // Location filter
        if (location?.trim()) {
            filter.location = new RegExp(location.trim(), "i");
        }

        // Job type filter
        if (jobType) {
            filter.jobType = jobType;
        }

        // Experience filter
        if (experience?.trim()) {
            filter.experience = new RegExp(experience.trim(), "i");
        }

        // Salary filter
        if (minSalary || maxSalary) {
            filter["salary.min"] = {};

            if (minSalary) {
                filter["salary.min"].$gte = Number(minSalary);
            }

            if (maxSalary) {
                filter["salary.min"].$lte = Number(maxSalary);
            }
        }

        // Pagination
        const currentPage = Math.max(Number(page) || 1, 1);
        const jobsPerPage = Math.min(
            Math.max(Number(limit) || 10, 1),
            50
        );

        const skip = (currentPage - 1) * jobsPerPage;

        // Get total matching jobs
        const totalJobs = await Job.countDocuments(filter);

        // Get jobs
        const jobs = await Job.find(filter)
            .populate("recruiter", "username email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(jobsPerPage);

        const totalPages = Math.ceil(totalJobs / jobsPerPage);

        return res.status(200).json({
            count: jobs.length,
            totalJobs,
            page: currentPage,
            limit: jobsPerPage,
            totalPages,
            jobs,
        });
    } catch (error) {
        console.error("Get Jobs Error:", error.message);

        return res.status(500).json({
            message: "Failed to fetch jobs",
        });
    }
};

// Get Single Job
const getJobById = async (req, res) => {
    try {
        const { id } = req.params;

        const job = await Job.findById(id).populate(
            "recruiter",
            "username email"
        );

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        return res.status(200).json({
            job,
        });
    } catch (error) {
        console.error("Get Job Error:", error.message);

        return res.status(500).json({
            message: "Failed to fetch job",
        });
    }
};

// Update Job
const updateJob = async (req, res) => {
    try {
        const { id } = req.params;

        const job = await Job.findById(id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        // Only the recruiter who created the job can update it
        // Admin authorization can be added separately.
        if (job.recruiter.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not allowed to update this job",
            });
        }

        const updatedJob = await Job.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        return res.status(200).json({
            message: "Job updated successfully",
            job: updatedJob,
        });
    } catch (error) {
        console.error("Update Job Error:", error.message);

        return res.status(500).json({
            message: "Failed to update job",
        });
    }
};

// Delete Job
const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;

        const job = await Job.findById(id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
            });
        }

        // Only the recruiter who created the job can delete it
        if (job.recruiter.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not allowed to delete this job",
            });
        }

        await Job.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Job deleted successfully",
        });
    } catch (error) {
        console.error("Delete Job Error:", error.message);

        return res.status(500).json({
            message: "Failed to delete job",
        });
    }
};

const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({
            recruiter: req.user._id,
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            count: jobs.length,
            jobs,
        });
    } catch (error) {
        console.error("Get My Jobs Error:", error.message);

        return res.status(500).json({
            message: "Failed to fetch your jobs",
        });
    }
};

export {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    getMyJobs,
};