
import { useState } from "react";
import { Menu, X, Briefcase } from "lucide-react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <nav className="w-full bg-[#EFEFF0]">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">

                {/* Logo */}
                <a
                    href="/"
                    className="flex items-center gap-2"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0A3ECA] text-white">
                        <Briefcase size={19} />
                    </div>

                    <span className="text-xl font-bold tracking-tight text-[#060606]">
                        JobHub
                    </span>
                </a>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-8 md:flex">
                    <a
                        href="/jobs"
                        className="text-sm font-medium text-[#060606] transition hover:text-[#0A3ECA]"
                    >
                        Find Jobs
                    </a>

                    <a
                        href="/applications"
                        className="text-sm font-medium text-[#060606] transition hover:text-[#0A3ECA]"
                    >
                        My Applications
                    </a>

                    {/* About */}
                    <a
                        href="/#about"
                        className="text-sm font-medium text-[#060606] transition hover:text-[#0A3ECA]"
                    >
                        About
                    </a>
                </div>

                {/* Desktop Buttons */}
                <div className="hidden items-center gap-3 md:flex">
                    <a
                        href="/login"
                        className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#060606] transition hover:bg-white"
                    >
                        Login
                    </a>

                    <a
                        href="/register"
                        className="rounded-full bg-[#0A3ECA] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0835aa]"
                    >
                        Get Started
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#060606] md:hidden"
                    aria-label="Toggle menu"
                >
                    {isOpen ? (
                        <X size={22} />
                    ) : (
                        <Menu size={22} />
                    )}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="border-t border-black/5 bg-[#EFEFF0] px-5 pb-6 pt-3 md:hidden">
                    <div className="flex flex-col gap-2">

                        <a
                            href="/jobs"
                            onClick={closeMenu}
                            className="rounded-xl px-4 py-3 text-sm font-medium text-[#060606] hover:bg-white"
                        >
                            Find Jobs
                        </a>

                        <a
                            href="/applications"
                            onClick={closeMenu}
                            className="rounded-xl px-4 py-3 text-sm font-medium text-[#060606] hover:bg-white"
                        >
                            My Applications
                        </a>

                        {/* About */}
                        <a
                            href="/#about"
                            onClick={closeMenu}
                            className="rounded-xl px-4 py-3 text-sm font-medium text-[#060606] hover:bg-white"
                        >
                            About
                        </a>

                        <div className="mt-3 flex gap-3">
                            <a
                                href="/login"
                                onClick={closeMenu}
                                className="flex-1 rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-[#060606]"
                            >
                                Login
                            </a>

                            <a
                                href="/register"
                                onClick={closeMenu}
                                className="flex-1 rounded-full bg-[#0A3ECA] px-5 py-3 text-center text-sm font-semibold text-white"
                            >
                                Get Started
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
