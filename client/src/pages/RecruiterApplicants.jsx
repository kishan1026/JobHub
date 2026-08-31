import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    Search,
    Users,
    UserCheck,
    X,
    FileText,
    ChevronDown,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL;

const RecruiterApplicants = () => {
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedApplicant, setSelectedApplicant] = useState(null);

    const [message, setMessage] = useState({
        type: "",
        text: "",
    });

    const showMessage = (type, text) => {
        setMessage({ type, text });

        setTimeout(() => {
            setMessage({ type: "", text: "" });
        }, 3000);
    };

    const fetchJobs = async () => {
        try {
            const response = await axios.get(
                `${API}/jobs/my-jobs`,
                {
                    withCredentials: true,
                }
            );

            setJobs(response.data.jobs || []);
        } catch (error) {
            showMessage(
                "error",
                error.response?.data?.message ||
                    "Failed to load jobs"
            );
        }
    };

    const fetchApplications = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${API}/applications/recruiter`,
                {
                    withCredentials: true,
                }
            );

            setApplications(
                response.data.applications || []
            );
        } catch (error) {
            console.error(error);

            showMessage(
                "error",
                error.response?.data?.message ||
                    "Failed to load applicants"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        Promise.all([
            fetchJobs(),
            fetchApplications(),
        ]);
    }, []);

    const getCandidate = (application) => {
        return (
            application.candidate ||
            application.applicant ||
            application.user ||
            {}
        );
    };

    const getJob = (application) => {
        return (
            application.job ||
            {}
        );
    };

    const getMatchScore = (application) => {
        return (
            application.aiMatch?.matchScore ??
            application.matchScore ??
            null
        );
    };

    const filteredApplications = useMemo(() => {
        const query = search.trim().toLowerCase();

        return applications.filter((application) => {
            const candidate = getCandidate(application);
            const job = getJob(application);

            const matchesJob =
                selectedJob === "all" ||
                job._id === selectedJob;

            const matchesStatus =
                statusFilter === "all" ||
                application.status === statusFilter;

            const matchesSearch =
                !query ||
                [
                    candidate.username,
                    candidate.name,
                    candidate.email,
                    job.title,
                    job.company,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase()
                    .includes(query);

            return (
                matchesJob &&
                matchesStatus &&
                matchesSearch
            );
        });
    }, [
        applications,
        selectedJob,
        statusFilter,
        search,
    ]);

    const updateStatus = async (
        applicationId,
        status
    ) => {
        try {
            await axios.patch(
                `${API}/applications/${applicationId}/status`,
                { status },
                {
                    withCredentials: true,
                }
            );

            setApplications((prev) =>
                prev.map((application) =>
                    application._id === applicationId
                        ? {
                              ...application,
                              status,
                          }
                        : application
                )
            );

            if (selectedApplicant?._id === applicationId) {
                setSelectedApplicant((prev) => ({
                    ...prev,
                    status,
                }));
            }

            showMessage(
                "success",
                "Application status updated"
            );
        } catch (error) {
            showMessage(
                "error",
                error.response?.data?.message ||
                    "Failed to update status"
            );
        }
    };

    const stats = useMemo(() => {
        return {
            total: applications.length,

            applied: applications.filter(
                (a) => a.status === "applied"
            ).length,

            review: applications.filter(
                (a) => a.status === "under-review"
            ).length,

            shortlisted: applications.filter(
                (a) => a.status === "shortlisted"
            ).length,

            interview: applications.filter(
                (a) => a.status === "interview"
            ).length,

            selected: applications.filter(
                (a) => a.status === "selected"
            ).length,
        };
    }, [applications]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#EFEFF0] px-5 py-10">
                <div className="mx-auto max-w-7xl">
                    <div className="rounded-3xl bg-white p-10 text-center">
                        <p className="text-sm text-[#4B454F]">
                            Loading applicants...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#EFEFF0] px-5 py-8 text-[#060606] sm:px-8 lg:px-12">
            <div className="mx-auto max-w-7xl">

                {/* HEADER */}
                <div className="mb-8">
                    <p className="text-sm font-semibold text-[#0A3ECA]">
                        Recruiter
                    </p>

                    <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                        Applicants
                    </h1>

                    <p className="mt-2 text-sm text-[#4B454F]">
                        Review candidates and manage your hiring pipeline.
                    </p>
                </div>

                {/* MESSAGE */}
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
                <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {[
                        ["Total", stats.total],
                        ["Applied", stats.applied],
                        ["Review", stats.review],
                        ["Shortlisted", stats.shortlisted],
                        ["Interview", stats.interview],
                        ["Selected", stats.selected],
                    ].map(([label, value]) => (
                        <div
                            key={label}
                            className="rounded-2xl bg-white p-5"
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

                {/* FILTERS */}
                <div className="mb-6 rounded-2xl bg-white p-4">
                    <div className="grid gap-3 lg:grid-cols-[1fr_220px_190px]">

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
                                placeholder="Search candidate or job..."
                                className="w-full rounded-xl border border-black/10 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#0A3ECA]"
                            />
                        </div>

                        <div className="relative">
                            <select
                                value={selectedJob}
                                onChange={(e) =>
                                    setSelectedJob(e.target.value)
                                }
                                className="w-full appearance-none rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#0A3ECA]"
                            >
                                <option value="all">
                                    All Jobs
                                </option>

                                {jobs.map((job) => (
                                    <option
                                        key={job._id}
                                        value={job._id}
                                    >
                                        {job.title}
                                    </option>
                                ))}
                            </select>

                            <ChevronDown
                                size={16}
                                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                            />
                        </div>

                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                className="w-full appearance-none rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#0A3ECA]"
                            >
                                <option value="all">
                                    All Status
                                </option>
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

                            <ChevronDown
                                size={16}
                                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                            />
                        </div>
                    </div>
                </div>

                {/* APPLICATIONS */}
                {filteredApplications.length === 0 ? (
                    <div className="rounded-3xl bg-white px-6 py-16 text-center">
                        <Users
                            size={34}
                            className="mx-auto text-[#4B454F]"
                        />

                        <h2 className="mt-4 text-lg font-bold">
                            No applicants found
                        </h2>

                        <p className="mt-2 text-sm text-[#4B454F]">
                            Try changing your filters or search.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredApplications.map(
                            (application) => {
                                const candidate =
                                    getCandidate(application);

                                const job =
                                    getJob(application);

                                const score =
                                    getMatchScore(application);

                                return (
                                    <div
                                        key={application._id}
                                        className="rounded-3xl bg-white p-5 sm:p-6"
                                    >
                                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                                            {/* CANDIDATE */}
                                            <div className="flex gap-4">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EFEFF0]">
                                                    <UserCheck
                                                        size={20}
                                                    />
                                                </div>

                                                <div>
                                                    <h3 className="font-bold">
                                                        {candidate.username ||
                                                            candidate.name ||
                                                            "Candidate"}
                                                    </h3>

                                                    <p className="mt-1 text-sm text-[#4B454F]">
                                                        {candidate.email ||
                                                            "No email"}
                                                    </p>

                                                    <p className="mt-2 text-sm">
                                                        Applied for{" "}
                                                        <span className="font-semibold">
                                                            {job.title ||
                                                                "Job"}
                                                        </span>
                                                    </p>

                                                    {job.company && (
                                                        <p className="mt-1 text-xs text-[#4B454F]">
                                                            {job.company}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* MATCH */}
                                            <div className="flex items-center gap-8">
                                                <div>
                                                    <p className="text-xs text-[#4B454F]">
                                                        AI Match
                                                    </p>

                                                    <p
                                                        className={`mt-1 text-2xl font-bold ${
                                                            score >= 80
                                                                ? "text-green-600"
                                                                : score >= 60
                                                                ? "text-yellow-600"
                                                                : "text-red-500"
                                                        }`}
                                                    >
                                                        {score !== null
                                                            ? `${score}%`
                                                            : "--"}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="mb-1 text-xs text-[#4B454F]">
                                                        Status
                                                    </p>

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
                                                        className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0A3ECA]"
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

                                            {/* ACTIONS */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        setSelectedApplicant(
                                                            application
                                                        )
                                                    }
                                                    className="flex items-center gap-2 rounded-xl bg-[#060606] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0A3ECA]"
                                                >
                                                    <UserCheck
                                                        size={16}
                                                    />
                                                    View Candidate
                                                </button>

                                                {candidate.resumeUrl && (
                                                    <a
                                                        href={
                                                            candidate.resumeUrl
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex items-center gap-2 rounded-xl border border-black/10 px-4 py-3 text-sm font-semibold hover:bg-[#EFEFF0]"
                                                    >
                                                        <FileText
                                                            size={16}
                                                        />
                                                        Resume
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}
            </div>

            {/* CANDIDATE MODAL */}
            {selectedApplicant && (
                <CandidateModal
                    application={selectedApplicant}
                    onClose={() =>
                        setSelectedApplicant(null)
                    }
                    onStatusChange={updateStatus}
                />
            )}
        </div>
    );
};

const CandidateModal = ({
    application,
    onClose,
    onStatusChange,
}) => {
    const candidate =
        application.candidate ||
        application.applicant ||
        application.user ||
        {};

    const job = application.job || {};

    const score =
        application.aiMatch?.matchScore ??
        application.matchScore ??
        null;

    const skills =
        candidate.skills ||
        candidate.profile?.skills ||
        [];

    const strengths =
        application.aiMatch?.strengths ||
        application.aiMatch?.matchedSkills ||
        [];

    const missingSkills =
        application.aiMatch?.missingSkills ||
        application.aiMatch?.missing ||
        [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5 py-8">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white">

                <div className="sticky top-0 flex items-center justify-between border-b border-black/10 bg-white p-6">
                    <div>
                        <p className="text-sm font-semibold text-[#0A3ECA]">
                            Candidate Profile
                        </p>

                        <h2 className="mt-1 text-xl font-bold">
                            {candidate.username ||
                                candidate.name ||
                                "Candidate"}
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-full p-2 hover:bg-[#EFEFF0]"
                    >
                        <X size={19} />
                    </button>
                </div>

                <div className="space-y-6 p-6">

                    {/* BASIC INFO */}
                    <div className="rounded-2xl bg-[#EFEFF0] p-5">
                        <p className="text-sm text-[#4B454F]">
                            Email
                        </p>

                        <p className="mt-1 font-semibold">
                            {candidate.email || "--"}
                        </p>

                        {candidate.phone && (
                            <>
                                <p className="mt-4 text-sm text-[#4B454F]">
                                    Phone
                                </p>

                                <p className="mt-1 font-semibold">
                                    {candidate.phone}
                                </p>
                            </>
                        )}

                        <p className="mt-4 text-sm text-[#4B454F]">
                            Applied For
                        </p>

                        <p className="mt-1 font-semibold">
                            {job.title || "--"}
                        </p>
                    </div>

                    {/* AI MATCH */}
                    <div className="rounded-2xl border border-black/10 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold">
                                    AI Match Score
                                </h3>

                                <p className="mt-1 text-sm text-[#4B454F]">
                                    Resume compatibility with this job.
                                </p>
                            </div>

                            <span className="text-3xl font-bold text-[#0A3ECA]">
                                {score !== null
                                    ? `${score}%`
                                    : "--"}
                            </span>
                        </div>

                        {strengths.length > 0 && (
                            <div className="mt-5">
                                <p className="text-sm font-semibold">
                                    Matching Skills
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {strengths.map(
                                        (skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700"
                                            >
                                                ✓ {skill}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                        {missingSkills.length > 0 && (
                            <div className="mt-5">
                                <p className="text-sm font-semibold">
                                    Missing Skills
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {missingSkills.map(
                                        (skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600"
                                            >
                                                {skill}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SKILLS */}
                    {skills.length > 0 && (
                        <div className="rounded-2xl border border-black/10 p-5">
                            <h3 className="font-bold">
                                Candidate Skills
                            </h3>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="rounded-full border border-black/10 px-3 py-1.5 text-xs"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STATUS */}
                    <div className="rounded-2xl border border-black/10 p-5">
                        <h3 className="font-bold">
                            Application Status
                        </h3>

                        <select
                            value={
                                application.status ||
                                "applied"
                            }
                            onChange={(e) =>
                                onStatusChange(
                                    application._id,
                                    e.target.value
                                )
                            }
                            className="mt-4 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#0A3ECA]"
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

                    {/* RESUME */}
                    {candidate.resumeUrl && (
                        <a
                            href={candidate.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#060606] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0A3ECA]"
                        >
                            <FileText size={17} />
                            View Resume
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecruiterApplicants;