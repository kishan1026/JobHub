import { useEffect, useState } from "react";
import axios from "axios";
import {
  BriefcaseBusiness,
  MapPin,
  Search,
  ArrowUpRight,
} from "lucide-react";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/jobs"
        );

        setJobs(response.data.jobs || []);
      } catch (error) {
        console.error("Fetch Jobs Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const text = `${job.title} ${job.company} ${job.location}`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <section className="min-h-screen bg-[#EFEFF0] px-5 py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold text-[#0A3ECA]">
            Find your next opportunity
          </p>

          <h1 className="text-3xl font-bold text-[#060606] sm:text-5xl">
            Find your dream job
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#4B454F] sm:text-base">
            Explore jobs from companies hiring right now.
          </p>
        </div>

        {/* Search */}
        <div className="mb-10 flex max-w-2xl items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
          <Search
            size={20}
            className="ml-2 text-[#4B454F]"
          />

          <input
            type="text"
            placeholder="Search by job, company or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent px-2 py-2 text-sm outline-none"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-3xl bg-white p-10 text-center">
            <p className="text-sm text-[#4B454F]">
              Loading jobs...
            </p>
          </div>
        )}

        {/* No jobs */}
        {!loading && filteredJobs.length === 0 && (
          <div className="rounded-3xl bg-white p-10 text-center">
            <p className="text-[#4B454F]">
              No jobs found.
            </p>
          </div>
        )}

        {/* Jobs */}
        {!loading && filteredJobs.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <article
                key={job._id}
                className="rounded-3xl bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
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
                  <h2 className="line-clamp-2 text-lg font-bold text-[#060606]">
                    {job.title}
                  </h2>

                  <p className="mt-1 text-sm font-medium text-[#4B454F]">
                    {job.company}
                  </p>
                </div>

                {/* Details */}
                <div className="mt-5 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-[#4B454F]">
                    <MapPin size={16} />
                    {job.location}
                  </div>

                  <p className="text-sm font-semibold text-[#060606]">
                    ₹{job.salary?.min?.toLocaleString("en-IN")} - ₹
                    {job.salary?.max?.toLocaleString("en-IN")}
                  </p>
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

                {/* View */}
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

export default Jobs;