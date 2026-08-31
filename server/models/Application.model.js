import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },

        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        resume: {
            type: String,
            trim: true,
        },

        coverLetter: {
            type: String,
            trim: true,
            maxlength: 2000,
        },

        status: {
            type: String,
            enum: [
                "applied",
                "under-review",
                "shortlisted",
                "interview",
                "selected",
                "rejected",
            ],
            default: "applied",
        },

        aiMatch: {
            matchScore: {
                type: Number,
                min: 0,
                max: 100,
            },

            matchedSkills: {
                type: [String],
                default: [],
            },

            missingSkills: {
                type: [String],
                default: [],
            },

            recommendations: {
                type: [String],
                default: [],
            },
        },
    },
    {
        timestamps: true,
    }
);

applicationSchema.index(
    { job: 1, applicant: 1 },
    { unique: true }
);

const Application = mongoose.model(
    "Application",
    applicationSchema
);

export default Application;