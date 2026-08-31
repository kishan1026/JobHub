import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Job title is required"],
            trim: true,
        },

        description: {
            type: String,
            required: [true, "Job description is required"],
            trim: true,
        },

        company: {
            type: String,
            required: [true, "Company name is required"],
            trim: true,
        },

        location: {
            type: String,
            required: [true, "Job location is required"],
            trim: true,
        },

        jobType: {
            type: String,
            enum: ["full-time", "part-time", "internship", "contract"],
            required: [true, "Job type is required"],
        },

        experience: {
            type: String,
            trim: true,
        },

        salary: {
            min: {
                type: Number,
                default: 0,
            },
            max: {
                type: Number,
                default: 0,
            },
            currency: {
                type: String,
                default: "INR",
                trim: true,
            },
        },

        skills: {
            type: [String],
            default: [],
        },

        responsibilities: {
            type: [String],
            default: [],
        },

        requirements: {
            type: [String],
            default: [],
        },

        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Recruiter is required"],
        },

        status: {
            type: String,
            enum: ["active", "closed"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;