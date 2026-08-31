
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  BriefcaseBusiness,
  MapPin,
  Send,
} from "lucide-react";

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(
          `${API}/jobs/${jobId}`
        );

        setJob(response.data.job);
      } catch (error) {
        console.error("Fetch Job Error:", error);
        setError("Unable to load job");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleApply = async (e) => {
    e.preventDefault();

    try {
      setApplying(true);
      setError("");
      setMessage("");

      const response = await axios.post(
        `${API}/applications/${jobId}`,
        {
          coverLetter,
        },
        {
          withCredentials: true,
        }
      );

      setMessage(
        response.data.message || "Application submitted successfully"
      );

      setCoverLetter("");
    } catch (error) {
      console.error("Apply Job Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to submit application"
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-[#EFEFF0] px-5 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm text-[#4B454F]">
            Loading job...
          </p>
        </div>
      </section>
    );
  }

  if (error && !job) {
    return (
      <section className="min-h-screen bg-[#EFEFF0] px-5 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-10 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#EFEFF0] px-5 py-10 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-[#4B454F] transition hover:text-[#0A3ECA]"
        >
          <ArrowLeft size={17} />
          Back to jobs
        </button>

        {/* Job Header */}
        <div className="rounded-3xl bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

            <div className="flex gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EFEFF0]">
                <BriefcaseBusiness
                  size={25}
                  className="text-[#0A3ECA]"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-[#060606] sm:text-3xl">
                  {job.title}
                </h1>

                <p className="mt-1 font-medium text-[#4B454F]">
                  {job.company}
                </p>
              </div>
            </div>

            <span className="w-fit rounded-full bg-[#EFEFF0] px-4 py-2 text-xs font-semibold text-[#4B454F]">
              {job.jobType}
            </span>
          </div>

          {/* Job details */}
          <div className="mt-7 flex flex-wrap gap-5 border-t border-[#EFEFF0] pt-6">
            <div className="flex items-center gap-2 text-sm text-[#4B454F]">
              <MapPin size={17} />
              {job.location}
            </div>

            <div className="text-sm font-semibold text-[#060606]">
              ₹{job.salary?.min?.toLocaleString("en-IN")} - ₹
              {job.salary?.max?.toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">

          {/* Description */}
          <div className="rounded-3xl bg-white p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[#060606]">
              Job description
            </h2>

            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#4B454F]">
              {job.description || "No description available."}
            </p>

            {job.skills?.length > 0 && (
              <div className="mt-8">
                <h3 className="font-bold text-[#060606]">
                  Required skills
                </h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-[#EFEFF0] px-3 py-2 text-xs font-medium text-[#4B454F]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Apply */}
          <div className="h-fit rounded-3xl bg-[#060606] p-6 sm:p-7">
            <h2 className="text-xl font-bold text-white">
              Apply for this job
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Submit your application with an optional cover letter.
            </p>

            <form onSubmit={handleApply} className="mt-6">

              <label className="text-sm font-medium text-white">
                Cover letter
              </label>

              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell the recruiter why you're a good fit..."
                rows={7}
                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white outline-none placeholder:text-gray-500 focus:border-[#0A3ECA]"
              />

              {message && (
                <p className="mt-3 rounded-xl bg-green-500/10 p-3 text-sm text-green-400">
                  {message}
                </p>
              )}

              {error && (
                <p className="mt-3 rounded-xl bg-red-500/10 p-3 text-sm text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={applying || !!message}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0A3ECA] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={17} />

                {applying ? "Applying..." : "Apply now"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobDetails;

