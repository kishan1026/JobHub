import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
            unique: true,
        },

        fullName: {
            type: String,
            trim: true,
            maxlength: 100,
        },

        phone: {
            type: String,
            trim: true,
            maxlength: 15,
        },

        bio: {
            type: String,
            trim: true,
            maxlength: 1000,
        },

        location: {
            type: String,
            trim: true,
        },

        skills: {
            type: [String],
            default: [],
        },

        education: [
            {
                degree: {
                    type: String,
                    trim: true,
                },
                institution: {
                    type: String,
                    trim: true,
                },
                startYear: {
                    type: Number,
                },
                endYear: {
                    type: Number,
                },
            },
        ],

        experience: [
            {
                company: {
                    type: String,
                    trim: true,
                },
                position: {
                    type: String,
                    trim: true,
                },
                startDate: {
                    type: Date,
                },
                endDate: {
                    type: Date,
                },
                description: {
                    type: String,
                    trim: true,
                },
            },
        ],

        resume: {
            type: String,
            trim: true,
        },

        profileImage: {
            type: String,
            trim: true,
        },
        resumeAnalysis: {
            name: {
                type: String,
                trim: true,
            },
        
            summary: {
                type: String,
                trim: true,
            },
        
            skills: {
                type: [String],
                default: [],
            },
        
            experience: [
                {
                    company: {
                        type: String,
                        trim: true,
                    },
        
                    role: {
                        type: String,
                        trim: true,
                    },
        
                    description: {
                        type: String,
                        trim: true,
                    },
                },
            ],
        
            education: [
                {
                    degree: {
                        type: String,
                        trim: true,
                    },
        
                    institution: {
                        type: String,
                        trim: true,
                    },
        
                    year: {
                        type: String,
                        trim: true,
                    },
                },
            ],
        
            projects: [
                {
                    name: {
                        type: String,
                        trim: true,
                    },
        
                    technologies: {
                        type: [String],
                        default: [],
                    },
        
                    description: {
                        type: String,
                        trim: true,
                    },
                },
            ],
        
            certifications: {
                type: [String],
                default: [],
            },
        },
    },
    {
        timestamps: true,
    }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;