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
    ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const JobSeekerDashboard = () => {
    const { user, logout } = useAuth();
    const API = import.meta.env.VITE_API_URL;

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [applications, setApplications] = useState([]);
    const [applicationsLoading, setApplicationsLoading] = useState(true);

    const [profile, setProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);


    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get(
                    `${API}/applications/my-applications`,
                    {
                        withCredentials: true,
                    }
                );

                setApplications(
                    response.data.applications || []
                );
            } catch (error) {
                console.error(
                    "Fetch Applications Error:",
                    error
                );
            } finally {
                setApplicationsLoading(false);
            }
        };

        fetchApplications();
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(
                    `${API}/profile/me`,
                    {
                        withCredentials: true,
                    }
                );

                setProfile(response.data.profile);
            } catch (error) {
                console.error(
                    "Fetch Profile Error:",
                    error
                );
            } finally {
                setProfileLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const resumeScore =
        profile?.resumeAnalysis?.score ??
        profile?.resumeAnalysis?.matchScore ??
        null;

    const underReviewCount = applications.filter(
        (application) =>
            application.status === "under-review"
    ).length;

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-[#EFEFF0] text-[#060606]">

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    onClick={closeSidebar}
                    className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-[#060606] p-5 text-white transition-transform duration-300 lg:translate-x-0 ${
                    sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                }`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between">
                    <Link
                        to="/"
                        className="flex items-center gap-3"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A3ECA]">
                            <BriefcaseBusiness size={20} />
                        </div>

                        <span className="text-xl font-bold">
                            JobHub
                        </span>
                    </Link>

                    <button
                        onClick={closeSidebar}
                        className="lg:hidden"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="mt-10 space-y-2">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium"
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
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
                    >
                        <FileText size={18} />
                        My Applications
                    </Link>

                    <Link
                        to="/saved-jobs"
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

                {/* Logout */}
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

                {/* Top bar */}
                <header className="sticky top-0 z-30 border-b border-black/5 bg-[#EFEFF0]/90 px-5 py-4 backdrop-blur-md sm:px-8">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() =>
                                setSidebarOpen(true)
                            }
                            className="rounded-xl bg-white p-2.5 lg:hidden"
                        >
                            <Menu size={20} />
                        </button>

                        <div className="hidden lg:block">
                            <p className="text-sm text-[#4B454F]">
                                Job Seeker Dashboard
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
                                {user?.username
                                    ?.charAt(0)
                                    ?.toUpperCase() || "U"}
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Content */}
                <main className="px-5 py-8 sm:px-8 lg:px-10">

                    {/* Welcome */}
                    <section>
                        <p className="text-sm font-medium text-[#0A3ECA]">
                            Welcome back 👋
                        </p>

                        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                            Find your next opportunity.
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4B454F]">
                            Discover jobs that match your skills,
                            track your applications, and improve your
                            chances with AI.
                        </p>
                    </section>

                    {/* Stats */}
                    <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                        {/* Applications */}
                        <div className="rounded-2xl bg-white p-5">
                            <p className="text-sm text-[#4B454F]">
                                Applications
                            </p>

                            <p className="mt-2 text-3xl font-bold">
                                {applicationsLoading
                                    ? "..."
                                    : applications.length}
                            </p>

                            <p className="mt-2 text-xs text-[#4B454F]">
                                Jobs you've applied to
                            </p>
                        </div>

                        {/* Under Review */}
                        <div className="rounded-2xl bg-white p-5">
                            <p className="text-sm text-[#4B454F]">
                                Under Review
                            </p>

                            <p className="mt-2 text-3xl font-bold">
                                {applicationsLoading
                                    ? "..."
                                    : underReviewCount}
                            </p>

                            <p className="mt-2 text-xs text-[#4B454F]">
                                Applications being reviewed
                            </p>
                        </div>

                        {/* Saved Jobs */}
                        <div className="rounded-2xl bg-white p-5">
                            <p className="text-sm text-[#4B454F]">
                                Saved Jobs
                            </p>

                            <p className="mt-2 text-3xl font-bold">
                                0
                            </p>

                            <p className="mt-2 text-xs text-[#4B454F]">
                                Jobs you've saved
                            </p>
                        </div>

                        {/* Resume Score */}
                        <div className="rounded-2xl bg-[#0A3ECA] p-5 text-white">
                            <p className="text-sm text-white/70">
                                AI Resume Score
                            </p>

                            <p className="mt-2 text-3xl font-bold">
                                {profileLoading
                                    ? "..."
                                    : resumeScore !== null
                                    ? `${resumeScore}%`
                                    : "--"}
                            </p>

                            <p className="mt-2 text-xs text-white/70">
                                {resumeScore !== null
                                    ? "Based on your latest AI analysis"
                                    : "Upload and analyze your resume"}
                            </p>
                        </div>
                    </section>

                    {/* Applications */}
                    <section className="mt-8 rounded-3xl bg-white p-5 sm:p-7">

                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold">
                                    Recent applications
                                </h2>

                                <p className="mt-1 text-sm text-[#4B454F]">
                                    Track your latest job applications.
                                </p>
                            </div>

                            <Link
                                to="/applications"
                                className="hidden items-center gap-1 text-sm font-semibold text-[#0A3ECA] sm:flex"
                            >
                                View all
                                <ChevronRight size={16} />
                            </Link>
                        </div>

                        <div className="mt-6 space-y-3">

                            {applicationsLoading ? (
                                <div className="py-10 text-center text-sm text-[#4B454F]">
                                    Loading applications...
                                </div>
                            ) : applications.length === 0 ? (
                                <div className="py-10 text-center">
                                    <FileText
                                        size={32}
                                        className="mx-auto text-[#4B454F]"
                                    />

                                    <p className="mt-3 text-sm font-semibold">
                                        No applications yet
                                    </p>

                                    <p className="mt-1 text-xs text-[#4B454F]">
                                        Start applying to jobs that match your skills.
                                    </p>

                                    <Link
                                        to="/jobs"
                                        className="mt-4 inline-flex rounded-full bg-[#0A3ECA] px-4 py-2 text-xs font-semibold text-white"
                                    >
                                        Find jobs
                                    </Link>
                                </div>
                            ) : (
                                applications
                                    .slice(0, 5)
                                    .map((application) => (
                                        <div
                                            key={application._id}
                                            className="rounded-2xl border border-black/5 p-4 transition hover:border-black/10"
                                        >
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                                <div className="flex gap-4">
                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EFEFF0]">
                                                        <BriefcaseBusiness
                                                            size={20}
                                                            className="text-[#0A3ECA]"
                                                        />
                                                    </div>

                                                    <div>
                                                        <h3 className="text-sm font-bold">
                                                            {application.job?.title ||
                                                                "Job"}
                                                        </h3>

                                                        <p className="mt-1 text-xs text-[#4B454F]">
                                                            {application.job?.company ||
                                                                ""}
                                                        </p>

                                                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#4B454F]">

                                                            <span className="flex items-center gap-1">
                                                                <MapPin size={13} />
                                                                {application.job?.location ||
                                                                    "--"}
                                                            </span>

                                                            <span className="flex items-center gap-1">
                                                                <Clock3 size={13} />

                                                                {application.createdAt
                                                                    ? new Date(
                                                                          application.createdAt
                                                                      ).toLocaleDateString(
                                                                          "en-IN",
                                                                          {
                                                                              day: "numeric",
                                                                              month: "short",
                                                                              year: "numeric",
                                                                          }
                                                                      )
                                                                    : "--"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <span className="w-fit rounded-full bg-[#EFEFF0] px-3 py-1.5 text-xs font-semibold capitalize">
                                                    {application.status ||
                                                        "applied"}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>

                        <Link
                            to="/applications"
                            className="mt-5 flex items-center justify-center gap-1 text-sm font-semibold text-[#0A3ECA] sm:hidden"
                        >
                            View all applications
                            <ChevronRight size={16} />
                        </Link>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default JobSeekerDashboard;