import {
    ArrowRight,
    Search,
    Sparkles,
    MapPin,
} from "lucide-react";

const Hero = () => {
    return (
        <section className="relative overflow-hidden bg-[#EFEFF0]">
            <div className="mx-auto max-w-7xl px-5 pb-20 pt-10 lg:px-8 lg:pb-28 lg:pt-16">

                {/* Hero Content */}
                <div className="mx-auto max-w-4xl text-center">

                    {/* Badge */}
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#4B454F] shadow-sm">
                        <Sparkles
                            size={16}
                            className="text-[#0A3ECA]"
                        />
                        AI-powered job matching
                    </div>

                    {/* Heading */}
                    <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-[#060606] sm:text-6xl lg:text-7xl">
                        Find a job that
                        <span className="text-[#0A3ECA]">
                            {" "}fits you.
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#4B454F] sm:text-lg">
                        Discover opportunities matched to your skills,
                        experience, and career goals with the power of AI.
                    </p>

                    {/* Search Box */}
                    <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-white p-2 shadow-lg shadow-black/5">

                        <div className="flex flex-col gap-2 md:flex-row">

                            {/* Job Search */}
                            <div className="flex flex-1 items-center gap-3 rounded-xl px-4 py-3">
                                <Search
                                    size={20}
                                    className="shrink-0 text-[#4B454F]"
                                />

                                <input
                                    type="text"
                                    placeholder="Job title, skills or keywords"
                                    className="w-full bg-transparent text-sm text-[#060606] outline-none placeholder:text-[#9A9AA0]"
                                />
                            </div>

                            {/* Location */}
                            <div className="flex flex-1 items-center gap-3 rounded-xl px-4 py-3 md:border-l md:border-black/10">
                                <MapPin
                                    size={20}
                                    className="shrink-0 text-[#4B454F]"
                                />

                                <input
                                    type="text"
                                    placeholder="Location"
                                    className="w-full bg-transparent text-sm text-[#060606] outline-none placeholder:text-[#9A9AA0]"
                                />
                            </div>

                            {/* Search Button */}
                            <button className="flex items-center justify-center gap-2 rounded-xl bg-[#0A3ECA] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0835AA]">
                                Search
                                <ArrowRight size={17} />
                            </button>
                        </div>
                    </div>

                    {/* Popular Searches */}
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
                        <span className="text-[#4B454F]">
                            Popular:
                        </span>

                        {[
                            "MERN Developer",
                            "React Developer",
                            "Node.js Developer",
                            "Frontend Developer",
                        ].map((item) => (
                            <button
                                key={item}
                                className="rounded-full bg-white px-3 py-1.5 text-[#060606] transition hover:bg-[#0A3ECA] hover:text-white"
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bottom Stats */}
                <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">

                    <div className="rounded-2xl bg-white p-5 text-center">
                        <p className="text-2xl font-bold text-[#060606]">
                            10K+
                        </p>
                        <p className="mt-1 text-xs text-[#4B454F]">
                            Active Jobs
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 text-center">
                        <p className="text-2xl font-bold text-[#060606]">
                            5K+
                        </p>
                        <p className="mt-1 text-xs text-[#4B454F]">
                            Companies
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 text-center">
                        <p className="text-2xl font-bold text-[#060606]">
                            92%
                        </p>
                        <p className="mt-1 text-xs text-[#4B454F]">
                            Match Accuracy
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 text-center">
                        <p className="text-2xl font-bold text-[#060606]">
                            24/7
                        </p>
                        <p className="mt-1 text-xs text-[#4B454F]">
                            AI Assistance
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;