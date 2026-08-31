import Profile from "../models/Profile.model.js";
import cloudinary from "../config/cloudinary.js";
import extractResumeText from "../utils/resumeParser.js";
import analyzeResume from "../services/resumeAI.service.js";

// Get current user's profile
const getMyProfile = async (req, res) => {
    try {
        let profile = await Profile.findOne({
            user: req.user._id,
        }).populate("user", "username email role");

        // If profile doesn't exist, create an empty one
        if (!profile) {
            profile = await Profile.create({
                user: req.user._id,
            });

            profile = await Profile.findById(profile._id).populate(
                "user",
                "username email role"
            );
        }

        return res.status(200).json({
            profile,
        });
    } catch (error) {
        console.error("Get Profile Error:", error.message);

        return res.status(500).json({
            message: "Failed to fetch profile",
        });
    }
};

// Create or update profile
const updateProfile = async (req, res) => {
    try {
        const {
            fullName,
            phone,
            bio,
            location,
            skills,
            education,
            experience,
            resume,
            profileImage,
        } = req.body;

        const profile = await Profile.findOneAndUpdate(
            {
                user: req.user._id,
            },
            {
                fullName,
                phone,
                bio,
                location,
                skills,
                education,
                experience,
                resume,
                profileImage,
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
            }
        ).populate("user", "username email role");

        return res.status(200).json({
            message: "Profile updated successfully",
            profile,
        });
    } catch (error) {
        console.error("Update Profile Error:", error.message);

        return res.status(500).json({
            message: "Failed to update profile",
        });
    }
};

const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Resume PDF is required",
            });
        }

        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "jobhub/resumes",
                    resource_type: "raw",
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            stream.end(req.file.buffer);
        });

        const profile = await Profile.findOneAndUpdate(
            {
                user: req.user._id,
            },
            {
                resume: uploadResult.secure_url,
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
            }
        );

        return res.status(200).json({
            message: "Resume uploaded successfully",
            resume: uploadResult.secure_url,
            profile,
        });
    } catch (error) {
        console.error("Resume Upload Error:", error.message);

        return res.status(500).json({
            message: "Failed to upload resume",
        });
    }
};

const testResumeParser = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Resume PDF is required",
            });
        }

        const resumeText = await extractResumeText(
            req.file.buffer
        );

        return res.status(200).json({
            message: "Resume text extracted successfully",
            text: resumeText,
        });
    } catch (error) {
        console.error("Resume Parser Test Error:", error.message);

        return res.status(500).json({
            message: "Failed to extract resume text",
        });
    }
};

const analyzeResumeWithAI = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Resume PDF is required",
            });
        }

        console.log("📄 Extracting resume text...");

        const resumeText = await extractResumeText(
            req.file.buffer
        );

        console.log("🤖 Sending resume to AI...");

        const aiResponse = await analyzeResume(
            resumeText
        );

        console.log("🧹 Processing AI response...");

        let resumeAnalysis;

        try {
            resumeAnalysis = JSON.parse(aiResponse);
        } catch (error) {
            console.error(
                "❌ AI returned invalid JSON:",
                aiResponse
            );

            return res.status(500).json({
                message: "AI returned invalid resume data",
            });
        }

        console.log("💾 Saving analysis to MongoDB...");

        const profile = await Profile.findOneAndUpdate(
            {
                user: req.user._id,
            },
            {
                resumeAnalysis,
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
            }
        );

        return res.status(200).json({
            message: "Resume analyzed and saved successfully",
            resumeAnalysis: profile.resumeAnalysis,
        });

    } catch (error) {
        console.error(
            "AI Resume Controller Error:",
            error.message
        );

        return res.status(500).json({
            message: error.message || "Failed to analyze resume",
        });
    }
};

export {
    getMyProfile,
    updateProfile,
    uploadResume,
    testResumeParser,
    analyzeResumeWithAI,
};