
import { useEffect, useState } from "react";
import axios from "axios";
import { UserRound, Upload, Sparkles } from "lucide-react";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);


    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        bio: "",
        location: "",
        skills: "",
    });

    const API = import.meta.env.VITE_API_URL;

    // Get profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(
                    `${API}/profile/me`,
                    {
                        withCredentials: true,
                    }
                );

                const data = response.data.profile;

                setProfile(data);

                setForm({
                    fullName: data.fullName || "",
                    phone: data.phone || "",
                    bio: data.bio || "",
                    location: data.location || "",
                    skills: data.skills?.join(", ") || "",
                });
            } catch (error) {
                console.error("Fetch Profile Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // Update profile
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            const response = await axios.put(
                `${API}/profile/me`,
                {
                    fullName: form.fullName,
                    phone: form.phone,
                    bio: form.bio,
                    location: form.location,
                    skills: form.skills
                        .split(",")
                        .map((skill) => skill.trim())
                        .filter(Boolean),
                },
                {
                    withCredentials: true,
                }
            );

            setProfile(response.data.profile);

            alert("Profile updated successfully");
        } catch (error) {
            console.error("Update Profile Error:", error);
            alert(
                error.response?.data?.message ||
                    "Failed to update profile"
            );
        } finally {
            setSaving(false);
        }
    };

    // Upload resume
    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (file.type !== "application/pdf") {
            alert("Please upload a PDF file");
            return;
        }

        const formData = new FormData();
        formData.append("resume", file);

        try {
            setUploading(true);

            const response = await axios.post(
                `${API}/profile/resume`,
                formData,
                {
                    withCredentials: true,
                }
            );

            setProfile(response.data.profile);

            alert("Resume uploaded successfully");
        } catch (error) {
            console.error("Resume Upload Error:", error);
            alert(
                error.response?.data?.message ||
                    "Failed to upload resume"
            );
        } finally {
            setUploading(false);
        }
    };

    // Analyze resume with AI
    const handleAnalyzeResume = async () => {
        if (!profile?.resume) {
            alert("Please upload your resume first");
            return;
        }

        try {
            setAnalyzing(true);

            // Download resume URL and convert it to a File
            const resumeResponse = await fetch(profile.resume);
            const blob = await resumeResponse.blob();

            const file = new File(
                [blob],
                "resume.pdf",
                {
                    type: "application/pdf",
                }
            );

            const formData = new FormData();
            formData.append("resume", file);

            const response = await axios.post(
                `${API}/profile/resume/analyze`,
                formData,
                {
                    withCredentials: true,
                }
            );

            setProfile((prev) => ({
                ...prev,
                resumeAnalysis:
                    response.data.resumeAnalysis,
            }));

            alert("Resume analyzed successfully");
        } catch (error) {
            console.error("Resume Analysis Error:", error);
            alert(
                error.response?.data?.message ||
                    "Failed to analyze resume"
            );
        } finally {
            setAnalyzing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#EFEFF0]">
                <p className="text-sm text-[#4B454F]">
                    Loading profile...
                </p>
            </div>
        );
    }

    const resumeScore =
        profile?.resumeAnalysis?.score ?? null;

    return (
        <div className="min-h-screen bg-[#EFEFF0] px-5 py-8 text-[#060606] sm:px-8 lg:px-12">

            <div className="mx-auto max-w-4xl">

                {/* Header */}
                <div className="mb-8">
                    <p className="text-sm font-medium text-[#0A3ECA]">
                        My Profile
                    </p>

                    <h1 className="mt-2 text-3xl font-bold">
                        Profile & Resume
                    </h1>

                    <p className="mt-2 text-sm text-[#4B454F]">
                        Update your profile and manage your resume.
                    </p>
                </div>

                {/* Profile Card */}
                <form
                    onSubmit={handleSubmit}
                    className="rounded-3xl bg-white p-6 sm:p-8"
                >
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFEFF0]">
                            <UserRound
                                size={21}
                                className="text-[#0A3ECA]"
                            />
                        </div>

                        <div>
                            <h2 className="font-bold">
                                Personal Information
                            </h2>

                            <p className="text-xs text-[#4B454F]">
                                Keep your profile information up to date.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">

                        <div>
                            <label className="text-sm font-medium">
                                Full Name
                            </label>

                            <input
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                placeholder="Your full name"
                                className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#0A3ECA]"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Phone
                            </label>

                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Your phone number"
                                className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#0A3ECA]"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Location
                            </label>

                            <input
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                placeholder="Chandigarh"
                                className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#0A3ECA]"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Skills
                            </label>

                            <input
                                name="skills"
                                value={form.skills}
                                onChange={handleChange}
                                placeholder="React, Node.js, MongoDB"
                                className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#0A3ECA]"
                            />

                            <p className="mt-1 text-xs text-[#4B454F]">
                                Separate skills with commas.
                            </p>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="text-sm font-medium">
                                Bio
                            </label>

                            <textarea
                                name="bio"
                                value={form.bio}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Tell recruiters about yourself..."
                                className="mt-2 w-full resize-none rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#0A3ECA]"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="mt-6 rounded-xl bg-[#0A3ECA] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                    >
                        {saving ? "Saving..." : "Save Profile"}
                    </button>
                </form>

                {/* Resume */}
                <div className="mt-6 rounded-3xl bg-white p-6 sm:p-8">

                    <h2 className="font-bold">
                        Resume
                    </h2>

                    <p className="mt-1 text-sm text-[#4B454F]">
                        Upload your PDF resume and analyze it with AI.
                    </p>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-black/10 px-5 py-3 text-sm font-semibold">
                            <Upload size={17} />

                            {uploading
                                ? "Uploading..."
                                : "Upload Resume"}

                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleResumeUpload}
                                className="hidden"
                            />
                        </label>

                        {profile?.resume && (
                            <button
                                onClick={handleAnalyzeResume}
                                disabled={analyzing}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A3ECA] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                            >
                                <Sparkles size={17} />

                                {analyzing
                                    ? "Analyzing..."
                                    : "Analyze Resume"}
                            </button>
                        )}
                    </div>

                    {/* Resume status */}
                    {profile?.resume && (
                        <p className="mt-4 text-xs text-green-600">
                            ✓ Resume uploaded successfully
                        </p>
                    )}
                </div>

                {/* AI Score */}
                <div className="mt-6 rounded-3xl bg-[#0A3ECA] p-6 text-white sm:p-8">

                    <p className="text-sm text-white/70">
                        AI Resume Score
                    </p>

                    <p className="mt-2 text-5xl font-bold">
                        {resumeScore !== null
                            ? `${resumeScore}%`
                            : "--"}
                    </p>

                    <p className="mt-2 text-sm text-white/70">
                        {resumeScore !== null
                            ? "Based on your latest AI analysis."
                            : "Upload and analyze your resume to get your score."}
                    </p>

                </div>

            </div>
        </div>
    );
};

export default Profile;

