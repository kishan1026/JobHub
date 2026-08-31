import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
    LayoutDashboard,
    BriefcaseBusiness,
    FileText,
    UserRound,
    Bookmark,
    LogOut,
    Menu,
    X,
    MapPin,
    Clock3,
    Sparkles,
    ArrowLeft,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const statusStyles = {
    applied: "bg-[#EFEFF0] text-[#4B454F]",
    "under-review": "bg-amber-50 text-amber-600",
    shortlisted: "bg-blue-50 text-[#0A3ECA]",
    interview: "bg-purple-50 text-purple-600",
    selected: "bg-green-50 text-green-600",
    rejected: "bg-red-50 text-red-600",
};

const statusLabels = {
    applied: "Applied",
    "under-review": "Under Review",
    shortlisted: "Shortlisted",
    interview: "Interview",
    selected: "Selected",
    rejected: "Rejected",
};

const filters = [
    "all",
    "applied",
    "under-review",
    "shortlisted",
    "interview",
    "selected",
    "rejected",
];

const Applications = () => {
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("all");
    const API = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get(
                    `${API}/applications/my-applications`,
                    {
                        withCredentials: true,
                    }
                );

                setApplications(response.data.applications || []);
            } catch (error) {
                console.error("Fetch Applications Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const closeSidebar = () => setSidebarOpen(false);

    const filteredApplications =
        activeFilter === "all"
            ? applications
            : applications.filter(
                  (application) => application.status === activeFilter
              );

    return (
        <div className="min-h-screen bg-[#EFEFF0] text-[#060606]">

            {sidebarOpen && (
                <div
                    onClick={closeSidebar}
                    className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-[#060606] p-5 text-white transition-transform duration-300 lg:translate-x-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A3ECA]">
                            <BriefcaseBusiness size={20} />
                        </div>
                        <span className="text-xl font-bold">JobHub</span>
                    </Link>

                    <button onClick={closeSidebar} className="lg:hidden">
                        <X size={22} />
                    </button>
                </div>

                <nav className="mt-10 space-y-2">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
                    >
                        <LayoutDashboard size={18} />
                        Dashboard
                    </Link>

                    <Link
                        to="/jobs"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
                    >
                        <BriefcaseBusiness size={18} />
                        Find Jobs
                    </Link>

                    <Link
                        to="/applications"
                        className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium"
                    >
                        <FileText size={18} />
                        My Applications
                    </Link>

                    <Link
                        to="/jobs"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
                    >
                        <Bookmark size={18} />
                        Saved Jobs
                    </Link>

                    <Link
                        to="/profile"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
                    >
                        <UserRound size={18} />
                        My Profile
                    </Link>
                </nav>

                <div className="mt-auto">
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="lg:ml-72">
                <header className="sticky top-0 z-30 border-b border-black/5 bg-[#EFEFF0]/90 px-5 py-4 backdrop-blur-md sm:px-8">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-xl bg-white p-2.5 lg:hidden"
                        >
                            <Menu size={20} />
                        </button>

                        <div className="hidden lg:block">
                            <p className="text-sm text-[#4B454F]">
                                My Applications
                            </p>
                        </div>

                        <Link
                            to="/profile"
                            className="ml-auto flex items-center gap-3"
                        >
                            <div className="hidden text-right sm:block">
                                <p className="text-sm font-semibold">
                                    {user?.username || "User"}
                                </p>
                                <p className="text-xs text-[#4B454F]">
                                    Job Seeker
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0A3ECA] text-sm font-bold text-white">
                                {user?.username?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                        </Link>
                    </div>
                </header>

                <main className="px-5 py-8 sm:px-8 lg:px-10">

                    <div className="flex items-center gap-3">
                        <Link
                            to="/dashboard"
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#4B454F] hover:text-[#060606]"
                        >
                            <ArrowLeft size={18} />
                        </Link>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                My Applications
                            </h1>
                            <p className="mt-1 text-sm text-[#4B454F]">
                                Track every job you've applied to.
                            </p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mt-6 flex flex-wrap gap-2">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition ${
                                    activeFilter === filter
                                        ? "bg-[#0A3ECA] text-white"
                                        : "bg-white text-[#4B454F] hover:text-[#060606]"
                                }`}
                            >
                                {filter === "all"
                                    ? "All"
                                    : statusLabels[filter]}
                            </button>
                        ))}
                    </div>

                    {/* List */}
                    <section className="mt-6 space-y-4">
                        {loading ? (
                            <div className="rounded-3xl bg-white p-10 text-center text-sm text-[#4B454F]">
                                Loading applications...
                            </div>
                        ) : filteredApplications.length === 0 ? (
                            <div className="rounded-3xl bg-white p-10 text-center">
                                <FileText
                                    size={32}
                                    className="mx-auto text-[#4B454F]"
                                />
                                <p className="mt-3 text-sm font-semibold">
                                    No applications found
                                </p>
                                <p className="mt-1 text-xs text-[#4B454F]">
                                    Try a different filter or apply to more jobs.
                                </p>
                                <Link
                                    to="/jobs"
                                    className="mt-4 inline-flex rounded-full bg-[#0A3ECA] px-4 py-2 text-xs font-semibold text-white"
                                >
                                    Find jobs
                                </Link>
                            </div>
                        ) : (
                            filteredApplications.map((application) => (
                                <div
                                    key={application._id}
                                    className="rounded-3xl bg-white p-5 sm:p-6"
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="flex gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EFEFF0]">
                                                <BriefcaseBusiness
                                                    size={20}
                                                    className="text-[#0A3ECA]"
                                                />
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-bold sm:text-base">
                                                    {application.job?.title}
                                                </h3>
                                                <p className="mt-1 text-xs text-[#4B454F] sm:text-sm">
                                                    {application.job?.company}
                                                </p>

                                                <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#4B454F]">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin size={13} />
                                                        {application.job?.location}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock3 size={13} />
                                                        {new Date(
                                                            application.createdAt
                                                        ).toLocaleDateString(
                                                            "en-IN",
                                                            {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric",
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <span
                                            className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
                                                statusStyles[application.status] ||
                                                statusStyles.applied
                                            }`}
                                        >
                                            {statusLabels[application.status] ||
                                                application.status}
                                        </span>
                                    </div>

                                    {application.aiMatch?.matchScore != null && (
                                        <div className="mt-4 rounded-2xl bg-[#EFEFF0] p-4">
                                            <div className="flex items-center gap-2">
                                                <Sparkles
                                                    size={15}
                                                    className="text-[#0A3ECA]"
                                                />
                                                <p className="text-xs font-semibold">
                                                    AI Match Score:{" "}
                                                    {application.aiMatch.matchScore}%
                                                </p>
                                            </div>

                                            {application.aiMatch.matchedSkills
                                                ?.length > 0 && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {application.aiMatch.matchedSkills
                                                        .slice(0, 6)
                                                        .map((skill) => (
                                                            <span
                                                                key={skill}
                                                                className="rounded-full bg-white px-3 py-1 text-xs text-[#4B454F]"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {application.coverLetter && (
                                        <p className="mt-4 text-sm leading-6 text-[#4B454F]">
                                            {application.coverLetter}
                                        </p>
                                    )}
                                </div>
                            ))
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Applications;