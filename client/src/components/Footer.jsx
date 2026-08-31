import { Link } from "react-router-dom";
import { BriefcaseBusiness } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-[#060606] px-5 py-12 text-white sm:px-8 lg:px-12">
            <div className="mx-auto max-w-7xl">

                <div className="grid gap-10 md:grid-cols-4">

                    {/* Brand */}
                    <div className="md:col-span-2">
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

                        <p className="mt-5 max-w-md text-sm leading-6 text-white/60">
                            Connecting talented people with great
                            opportunities and helping recruiters find
                            the right candidates.
                        </p>
                    </div>

                    {/* Explore */}
                    <div>
                        <h3 className="text-sm font-semibold">
                            Explore
                        </h3>

                        <div className="mt-4 space-y-3">
                            <Link
                                to="/"
                                className="block text-sm text-white/60 hover:text-white"
                            >
                                Home
                            </Link>

                            <Link
                                to="/jobs"
                                className="block text-sm text-white/60 hover:text-white"
                            >
                                Find Jobs
                            </Link>

                            <Link
                                to="/login"
                                className="block text-sm text-white/60 hover:text-white"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="block text-sm text-white/60 hover:text-white"
                            >
                                Register
                            </Link>
                        </div>
                    </div>

                    {/* Account */}
                    <div>
                        <h3 className="text-sm font-semibold">
                            Account
                        </h3>

                        <div className="mt-4 space-y-3">
                            <Link
                                to="/dashboard"
                                className="block text-sm text-white/60 hover:text-white"
                            >
                                Job Seeker Dashboard
                            </Link>

                            <Link
                                to="/recruiter/dashboard"
                                className="block text-sm text-white/60 hover:text-white"
                            >
                                Recruiter Dashboard
                            </Link>

                            <Link
                                to="/profile"
                                className="block text-sm text-white/60 hover:text-white"
                            >
                                Profile
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-10 border-t border-white/10 pt-6">
                    <p className="text-xs text-white/40">
                        © {new Date().getFullYear()} JobHub. All rights reserved.
                    </p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;