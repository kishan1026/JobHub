import { useEffect, useState } from "react";
import axios from "axios";
import {
    MapPin,
    BriefcaseBusiness,
    ArrowUpRight,
    Sparkles,
} from "lucide-react";

const FeaturedJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const API = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get(
                    `${API}/jobs`
                );

                setJobs(response.data.jobs || []);
            } catch (error) {
                console.error("Fetch Jobs Error:", error);

                setError("Unable to load jobs");
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) {
        return (
            <section className="bg-[#EFEFF0] px-5 py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="flex items-center justify-center py-20">
                        <p className="text-sm text-[#4B454F]">
                            Loading jobs...
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="bg-[#EFEFF0] px-5 py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="rounded-2xl bg-white p-8 text-center">
                        <p className="text-sm text-red-500">
                            {error}
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-[#EFEFF0] px-5 py-20 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Heading */}
                <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <Sparkles
                                size={17}
                                className="text-[#0A3ECA]"
                            />

                            <span className="text-sm font-semibold text-[#0A3ECA]">
                                Recommended opportunities
                            </span>
                        </div>

                        <h2 className="text-3xl font-bold tracking-tight text-[#060606] sm:text-4xl">
                            Featured jobs
                        </h2>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-[#4B454F] sm:text-base">
                            Explore the latest opportunities from
                            companies hiring right now.
                        </p>
                    </div>

                    <a
                        href="/jobs"
                        className="flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#060606] transition hover:bg-[#0A3ECA] hover:text-white"
                    >
                        View all jobs
                        <ArrowUpRight size={17} />
                    </a>
                </div>

                {/* Jobs */}
                {jobs.length === 0 ? (
                    <div className="rounded-3xl bg-white p-10 text-center">
                        <p className="text-[#4B454F]">
                            No jobs available right now.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {jobs.slice(0, 6).map((job) => (
                            <article
                                key={job._id}
                                className="group rounded-3xl bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
                            >
                                {/* Top */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFEFF0]">
                                        <BriefcaseBusiness
                                            size={22}
                                            className="text-[#0A3ECA]"
                                        />
                                    </div>

                                    <span className="rounded-full bg-[#EFEFF0] px-3 py-1.5 text-xs font-medium text-[#4B454F]">
                                        {job.jobType}
                                    </span>
                                </div>

                                {/* Job Info */}
                                <div className="mt-6">
                                    <h3 className="line-clamp-1 text-lg font-bold text-[#060606]">
                                        {job.title}
                                    </h3>

                                    <p className="mt-1 text-sm font-medium text-[#4B454F]">
                                        {job.company}
                                    </p>
                                </div>

                                {/* Details */}
                                <div className="mt-5 space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-[#4B454F]">
                                        <MapPin size={16} />
                                        {job.location}
                                    </div>

                                    <div className="text-sm font-semibold text-[#060606]">
                                        ₹{job.salary?.min?.toLocaleString("en-IN")}
                                        {" - "}
                                        ₹{job.salary?.max?.toLocaleString("en-IN")}
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="mt-5 flex flex-wrap gap-2">
                                    {job.skills?.slice(0, 4).map((skill) => (
                                        <span
                                            key={skill}
                                            className="rounded-full bg-[#EFEFF0] px-3 py-1.5 text-xs font-medium text-[#4B454F]"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                {/* Button */}
                                <a
                                    href={`/jobs/${job._id}`}
                                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#060606] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0A3ECA]"
                                >
                                    View job
                                    <ArrowUpRight size={17} />
                                </a>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedJobs;