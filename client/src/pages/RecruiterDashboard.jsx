// client/src/pages/RecruiterDashboard.jsx

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    BriefcaseBusiness,
    Plus,
    Users,
    X,
    Pencil,
    Trash2,
    LogOut,
    BarChart3,
    MoreVertical,
    CheckCircle2,
    Clock3,
    UserCheck,
    Search,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const emptyForm = {
    title: "",
    company: "",
    location: "",
    jobType: "full-time",
    description: "",
    skills: "",
    salaryMin: "",
    salaryMax: "",
    experience: "",
};

const RecruiterDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        applied: 0,
        "under-review": 0,
        shortlisted: 0,
        interview: 0,
        selected: 0,
        rejected: 0,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [editingJob, setEditingJob] = useState(null);

    const [selectedJob, setSelectedJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [applicantsLoading, setApplicantsLoading] = useState(false);

    const [deleteJob, setDeleteJob] = useState(null);
    const [openMenu, setOpenMenu] = useState(null);
    const [search, setSearch] = useState("");

    const [message, setMessage] = useState({
        type: "",
        text: "",
    });

    const [form, setForm] = useState(emptyForm);

    const showMessage = (type, text) => {
        setMessage({ type, text });

        setTimeout(() => {
            setMessage({ type: "", text: "" });
        }, 3000);
    };

    const fetchJobs = async () => {
        try {
            const response = await axios.get(`${API}/jobs/my-jobs`, {
                withCredentials: true,
            });

            setJobs(response.data.jobs || []);
        } catch (error) {
            console.error("Fetch Jobs Error:", error);
            showMessage(
                "error",
                error.response?.data?.message || "Failed to fetch jobs"
            );
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get(
                `${API}/applications/recruiter/stats`,
                {
                    withCredentials: true,
                }
            );

            setStats(response.data.stats || {});
        } catch (error) {
            console.error("Fetch Stats Error:", error);
        }
    };

    const loadDashboard = async () => {
        setLoading(true);

        await Promise.all([
            fetchJobs(),
            fetchStats(),
        ]);

        setLoading(false);
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const openCreateForm = () => {
        setEditingJob(null);
        setForm(emptyForm);
        setShowForm(true);
        setOpenMenu(null);
    };

    const openEditForm = (job) => {
        setEditingJob(job);

        setForm({
            title: job.title || "",
            company: job.company || "",
            location: job.location || "",
            jobType: job.jobType || "full-time",
            description: job.description || "",
            skills: Array.isArray(job.skills)
                ? job.skills.join(", ")
                : "",
            salaryMin: job.salary?.min ?? "",
            salaryMax: job.salary?.max ?? "",
            experience: job.experience || "",
        });

        setShowForm(true);
        setOpenMenu(null);
    };

    const closeForm = () => {
        if (saving) return;

        setShowForm(false);
        setEditingJob(null);
        setForm(emptyForm);
    };

    const handleSubmitJob = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            const payload = {
                title: form.title,
                company: form.company,
                location: form.location,
                jobType: form.jobType,
                description: form.description,
                experience: form.experience,
                skills: form.skills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean),
                salary: {
                    min: Number(form.salaryMin) || 0,
                    max: Number(form.salaryMax) || 0,
                    currency: "INR",
                },
            };

            if (editingJob) {
                const response = await axios.put(
                    `${API}/jobs/${editingJob._id}`,
                    payload,
                    {
                        withCredentials: true,
                    }
                );

                setJobs((prev) =>
                    prev.map((job) =>
                        job._id === editingJob._id
                            ? response.data.job
                            : job
                    )
                );

                showMessage("success", "Job updated successfully");
            } else {
                const response = await axios.post(
                    `${API}/jobs`,
                    payload,
                    {
                        withCredentials: true,
                    }
                );

                setJobs((prev) => [
                    response.data.job,
                    ...prev,
                ]);

                showMessage("success", "Job created successfully");
            }

            closeForm();
        } catch (error) {
            console.error("Save Job Error:", error);

            showMessage(
                "error",
                error.response?.data?.message ||
                    "Failed to save job"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteJob = async () => {
        if (!deleteJob) return;

        try {
            await axios.delete(
                `${API}/jobs/${deleteJob._id}`,
                {
                    withCredentials: true,
                }
            );

            setJobs((prev) =>
                prev.filter((job) => job._id !== deleteJob._id)
            );

            if (selectedJob?._id === deleteJob._id) {
                setSelectedJob(null);
                setApplicants([]);
            }

            setDeleteJob(null);
            showMessage("success", "Job deleted successfully");

            fetchStats();
        } catch (error) {
            console.error("Delete Job Error:", error);

            showMessage(
                "error",
                error.response?.data?.message ||
                    "Failed to delete job"
            );
        }
    };

    const toggleJobStatus = async (job) => {
        try {
            const nextStatus =
                job.status === "closed" ? "active" : "closed";
    
            const response = await axios.put(
                `${API}/jobs/${job._id}`,
                { status: nextStatus },
                { withCredentials: true }
            );
    
            setJobs((prev) =>
                prev.map((item) =>
                    item._id === job._id
                        ? response.data.job
                        : item
                )
            );
    
            setOpenMenu(null);
    
            showMessage(
                "success",
                nextStatus === "active"
                    ? "Job reopened successfully"
                    : "Job closed successfully"
            );
        } catch (error) {
            showMessage(
                "error",
                error.response?.data?.message ||
                    "Failed to update job status"
            );
        }
    };
    const viewApplicants = async (job) => {
        try {
            setSelectedJob(job);
            setApplicantsLoading(true);

            const response = await axios.get(
                `${API}/applications/job/${job._id}`,
                {
                    withCredentials: true,
                }
            );

            setApplicants(response.data.applications || []);

            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
            });
        } catch (error) {
            console.error("Fetch Applicants Error:", error);

            showMessage(
                "error",
                error.response?.data?.message ||
                    "Failed to fetch applicants"
            );
        } finally {
            setApplicantsLoading(false);
        }
    };

    const updateStatus = async (applicationId, status) => {
        try {
            await axios.patch(
                `${API}/applications/${applicationId}/status`,
                { status },
                {
                    withCredentials: true,
                }
            );

            setApplicants((prev) =>
                prev.map((application) =>
                    application._id === applicationId
                        ? {
                              ...application,
                              status,
                          }
                        : application
                )
            );

            fetchStats();
        } catch (error) {
            console.error("Update Status Error:", error);

            showMessage(
                "error",
                error.response?.data?.message ||
                    "Failed to update status"
            );
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const filteredJobs = useMemo(() => {
        const value = search.trim().toLowerCase();

        if (!value) return jobs;

        return jobs.filter((job) =>
            [
                job.title,
                job.company,
                job.location,
                job.jobType,
                ...(job.skills || []),
            ]
                .join(" ")
                .toLowerCase()
                .includes(value)
        );
    }, [jobs, search]);

    const activeJobs = jobs.filter(
        (job) => job.status !== "closed"
    ).length;

    const closedJobs = jobs.filter(
        (job) => job.status === "closed"
    ).length;

    const statCards = [
        {
            label: "Total Jobs",
            value: jobs.length,
            icon: BriefcaseBusiness,
        },
        {
            label: "Active Jobs",
            value: activeJobs,
            icon: CheckCircle2,
        },
        {
            label: "Closed Jobs",
            value: closedJobs,
            icon: Clock3,
        },
        {
            label: "Total Applicants",
            value: stats.total || 0,
            icon: Users,
        },
    ];

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#EFEFF0]">
                <p className="text-sm text-[#4B454F]">
                    Loading dashboard...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#EFEFF0] px-5 py-8 text-[#060606] sm:px-8 lg:px-12">
            <div className="mx-auto max-w-7xl">

                {/* HEADER */}
                <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-sm font-semibold text-[#0A3ECA]">
                            Recruiter Dashboard
                        </p>

                        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                            Manage your jobs
                        </h1>

                        <p className="mt-2 text-sm text-[#4B454F]">
                            Create jobs and manage candidates.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={openCreateForm}
                            className="flex w-fit items-center gap-2 rounded-xl bg-[#060606] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0A3ECA]"
                        >
                            <Plus size={17} />
                            Create Job
                        </button>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                            <LogOut size={17} />
                            <span className="hidden sm:inline">
                                Logout
                            </span>
                        </button>
                    </div>
                </div>

                {/* TOAST */}
                {message.text && (
                    <div
                        className={`mb-6 rounded-xl px-4 py-3 text-sm font-medium ${
                            message.type === "error"
                                ? "bg-red-50 text-red-600"
                                : "bg-green-50 text-green-700"
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                {/* STATS */}
                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.label}
                                className="rounded-2xl bg-white p-5"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-[#4B454F]">
                                            {stat.label}
                                        </p>

                                        <p className="mt-2 text-3xl font-bold">
                                            {stat.value}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-[#EFEFF0] p-3">
                                        <Icon size={20} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* APPLICATION PIPELINE */}
                <div className="mb-8 rounded-3xl bg-white p-6 sm:p-8">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-xl bg-[#EFEFF0] p-3">
                            <BarChart3 size={20} />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold">
                                Application Overview
                            </h2>

                            <p className="mt-1 text-sm text-[#4B454F]">
                                Track your hiring pipeline.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                        {[
                            ["Applied", stats.applied || 0],
                            ["Under Review", stats["under-review"] || 0],
                            ["Shortlisted", stats.shortlisted || 0],
                            ["Interview", stats.interview || 0],
                            ["Selected", stats.selected || 0],
                            ["Rejected", stats.rejected || 0],
                        ].map(([label, value]) => (
                            <div
                                key={label}
                                className="rounded-2xl border border-black/10 p-4"
                            >
                                <p className="text-xs text-[#4B454F]">
                                    {label}
                                </p>

                                <p className="mt-2 text-2xl font-bold">
                                    {value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CREATE / EDIT FORM */}
                {showForm && (
                    <div className="mb-8 rounded-3xl bg-white p-6 sm:p-8">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold">
                                    {editingJob
                                        ? "Edit Job"
                                        : "Create New Job"}
                                </h2>

                                <p className="mt-1 text-sm text-[#4B454F]">
                                    {editingJob
                                        ? "Update your job information."
                                        : "Add a new opportunity for candidates."}
                                </p>
                            </div>

                            <button
                                onClick={closeForm}
                                className="rounded-full p-2 hover:bg-[#EFEFF0]"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitJob}>
                            <div className="grid gap-5 sm:grid-cols-2">

                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Job title"
                                    required
                                    className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#0A3ECA]"
                                />

                                <input
                                    name="company"
                                    value={form.company}
                                    onChange={handleChange}
                                    placeholder="Company"
                                    required
                                    className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#0A3ECA]"
                                />

                                <input
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    placeholder="Location"
                                    required
                                    className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#0A3ECA]"
                                />

                                <select
                                    name="jobType"
                                    value={form.jobType}
                                    onChange={handleChange}
                                    className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none"
                                >
                                    <option value="full-time">
                                        Full-time
                                    </option>
                                    <option value="part-time">
                                        Part-time
                                    </option>
                                    <option value="internship">
                                        Internship
                                    </option>
                                    <option value="contract">
                                        Contract
                                    </option>
                                </select>

                                <input
                                    name="experience"
                                    value={form.experience}
                                    onChange={handleChange}
                                    placeholder="Experience e.g. 2-4 years"
                                    className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#0A3ECA]"
                                />

                                <input
                                    name="skills"
                                    value={form.skills}
                                    onChange={handleChange}
                                    placeholder="Skills: React, Node.js, MongoDB"
                                    required
                                    className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#0A3ECA]"
                                />

                                <input
                                    name="salaryMin"
                                    type="number"
                                    value={form.salaryMin}
                                    onChange={handleChange}
                                    placeholder="Minimum salary"
                                    required
                                    className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#0A3ECA]"
                                />

                                <input
                                    name="salaryMax"
                                    type="number"
                                    value={form.salaryMax}
                                    onChange={handleChange}
                                    placeholder="Maximum salary"
                                    required
                                    className="rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#0A3ECA]"
                                />

                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Job description"
                                    required
                                    rows={6}
                                    className="sm:col-span-2 rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#0A3ECA]"
                                />
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="rounded-xl border border-black/10 px-5 py-3 text-sm font-semibold hover:bg-[#EFEFF0]"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-[#060606] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0A3ECA] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingJob
                                        ? "Save Changes"
                                        : "Create Job"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* MY JOBS */}
                <div className="rounded-3xl bg-white p-6 sm:p-8">
                    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-xl font-bold">
                                My Jobs
                            </h2>

                            <p className="mt-1 text-sm text-[#4B454F]">
                                Manage your posted opportunities.
                            </p>
                        </div>

                        <div className="relative">
                            <Search
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B454F]"
                            />

                            <input
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search jobs..."
                                className="w-full rounded-xl border border-black/10 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#0A3ECA] sm:w-64"
                            />
                        </div>
                    </div>

                    {filteredJobs.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-black/10 px-6 py-12 text-center">
                            <BriefcaseBusiness
                                size={28}
                                className="mx-auto text-[#4B454F]"
                            />

                            <h3 className="mt-4 font-bold">
                                {search
                                    ? "No jobs found"
                                    : "No jobs posted yet"}
                            </h3>

                            <p className="mt-1 text-sm text-[#4B454F]">
                                {search
                                    ? "Try another search."
                                    : "Create your first job to start receiving applications."}
                            </p>

                            {!search && (
                                <button
                                    onClick={openCreateForm}
                                    className="mt-5 rounded-xl bg-[#060606] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0A3ECA]"
                                >
                                    Create Job
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-5 lg:grid-cols-2">
                            {filteredJobs.map((job) => (
                                <div
                                    key={job._id}
                                    className="rounded-2xl border border-black/10 p-5 transition hover:border-black/20"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-bold">
                                                    {job.title}
                                                </h3>

                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                        job.status === "closed"
                                                            ? "bg-[#EFEFF0] text-[#4B454F]"
                                                            : "bg-green-50 text-green-700"
                                                    }`}
                                                >
                                                    {job.status === "closed"
                                                        ? "Closed"
                                                        : "Active"}
                                                </span>
                                            </div>

                                            <p className="mt-1 text-sm text-[#4B454F]">
                                                {job.company}
                                            </p>

                                            <p className="mt-2 text-sm text-[#4B454F]">
                                                {job.location} ·{" "}
                                                {job.jobType}
                                            </p>
                                        </div>

                                        <div className="relative">
                                            <button
                                                onClick={() =>
                                                    setOpenMenu(
                                                        openMenu === job._id
                                                            ? null
                                                            : job._id
                                                    )
                                                }
                                                className="rounded-full p-2 hover:bg-[#EFEFF0]"
                                            >
                                                <MoreVertical size={18} />
                                            </button>

                                            {openMenu === job._id && (
                                                <div className="absolute right-0 z-20 mt-2 w-44 rounded-xl border border-black/10 bg-white p-1 shadow-xl">
                                                    <button
                                                        onClick={() =>
                                                            openEditForm(job)
                                                        }
                                                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-[#EFEFF0]"
                                                    >
                                                        <Pencil size={15} />
                                                        Edit Job
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            toggleJobStatus(
                                                                job
                                                            )
                                                        }
                                                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-[#EFEFF0]"
                                                    >
                                                        {job.status === "closed" ? (
                                                            <CheckCircle2 size={15} />
                                                        ) : (
                                                            <Clock3 size={15} />
                                                        )}

                                                        {job.status === "closed"
                                                            ? "Reopen Job"
                                                            : "Close Job"}
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setDeleteJob(job);
                                                            setOpenMenu(null);
                                                        }}
                                                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 size={15} />
                                                        Delete Job
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-5 grid grid-cols-2 gap-3">
                                        <div className="rounded-xl bg-[#EFEFF0] p-3">
                                            <p className="text-xs text-[#4B454F]">
                                                Salary
                                            </p>

                                            <p className="mt-1 text-sm font-semibold">
                                                ₹
                                                {Number(
                                                    job.salary?.min || 0
                                                ).toLocaleString()}{" "}
                                                - ₹
                                                {Number(
                                                    job.salary?.max || 0
                                                ).toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-[#EFEFF0] p-3">
                                            <p className="text-xs text-[#4B454F]">
                                                Status
                                            </p>

                                            <p className="mt-1 text-sm font-semibold capitalize">
                                                {job.status || "active"}
                                            </p>
                                        </div>
                                    </div>

                                    {job.skills?.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {job.skills
                                                .slice(0, 5)
                                                .map((skill) => (
                                                    <span
                                                        key={skill}
                                                        className="rounded-full border border-black/10 px-2.5 py-1 text-xs text-[#4B454F]"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                        </div>
                                    )}

                                    <button
                                        onClick={() =>
                                            viewApplicants(job)
                                        }
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#060606] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0A3ECA]"
                                    >
                                        <Users size={17} />
                                        View Applicants
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* APPLICANTS */}
                {selectedJob && (
                    <div className="mt-8 rounded-3xl bg-white p-6 sm:p-8">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-[#0A3ECA]">
                                    Applications
                                </p>

                                <h2 className="mt-1 text-xl font-bold">
                                    {selectedJob.title}
                                </h2>

                                <p className="mt-1 text-sm text-[#4B454F]">
                                    Review candidates and update their status.
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    setSelectedJob(null);
                                    setApplicants([]);
                                }}
                                className="rounded-full p-2 hover:bg-[#EFEFF0]"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        {applicantsLoading ? (
                            <p className="text-sm text-[#4B454F]">
                                Loading applicants...
                            </p>
                        ) : applicants.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-black/10 px-6 py-10 text-center">
                                <Users
                                    size={28}
                                    className="mx-auto text-[#4B454F]"
                                />

                                <p className="mt-3 text-sm text-[#4B454F]">
                                    No applicants yet.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {applicants.map((application) => {
                                    const candidate =
                                        application.candidate ||
                                        application.applicant ||
                                        {};

                                    return (
                                        <div
                                            key={application._id}
                                            className="rounded-2xl border border-black/10 p-5"
                                        >
                                            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                                                <div className="flex items-start gap-4">
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EFEFF0]">
                                                        <UserCheck
                                                            size={19}
                                                        />
                                                    </div>

                                                    <div>
                                                        <h3 className="font-bold">
                                                            {candidate.username ||
                                                                "Candidate"}
                                                        </h3>

                                                        <p className="mt-1 text-sm text-[#4B454F]">
                                                            {candidate.email ||
                                                                ""}
                                                        </p>

                                                        <div className="mt-2 flex flex-wrap items-center gap-2">
                                                            <span className="text-sm">
                                                                AI Match:
                                                            </span>

                                                            <span className="font-bold text-[#0A3ECA]">
                                                                {application
                                                                    .aiMatch
                                                                    ?.matchScore ??
                                                                    "--"}
                                                                %
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                                    <label className="text-xs text-[#4B454F]">
                                                        Status
                                                    </label>

                                                    <select
                                                        value={
                                                            application.status ||
                                                            "applied"
                                                        }
                                                        onChange={(e) =>
                                                            updateStatus(
                                                                application._id,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-[#0A3ECA]"
                                                    >
                                                        <option value="applied">
                                                            Applied
                                                        </option>
                                                        <option value="under-review">
                                                            Under Review
                                                        </option>
                                                        <option value="shortlisted">
                                                            Shortlisted
                                                        </option>
                                                        <option value="interview">
                                                            Interview
                                                        </option>
                                                        <option value="selected">
                                                            Selected
                                                        </option>
                                                        <option value="rejected">
                                                            Rejected
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* DELETE MODAL */}
            {deleteJob && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                            <Trash2
                                size={21}
                                className="text-red-600"
                            />
                        </div>

                        <h2 className="mt-5 text-xl font-bold">
                            Delete this job?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[#4B454F]">
                            You are about to delete{" "}
                            <strong className="text-[#060606]">
                                {deleteJob.title}
                            </strong>
                            . This action cannot be undone.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteJob(null)}
                                className="rounded-xl border border-black/10 px-5 py-3 text-sm font-semibold hover:bg-[#EFEFF0]"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDeleteJob}
                                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
                            >
                                Delete Job
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecruiterDashboard;