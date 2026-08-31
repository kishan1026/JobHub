import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, Eye, EyeOff } from "lucide-react";
import axios from "axios";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "jobseeker",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:3000/api/users/register",
                formData
            );

            console.log(
                "Registration successful:",
                response.data
            );

            navigate("/login");
        } catch (error) {
            console.error("Register Error:", error);

            setError(
                error.response?.data?.message ||
                    "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#EFEFF0] px-5 py-10">

            <div className="w-full max-w-md">

                {/* Logo */}
                <Link
                    to="/"
                    className="mb-8 flex items-center justify-center gap-2"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A3ECA] text-white">
                        <BriefcaseBusiness size={20} />
                    </div>

                    <span className="text-xl font-bold text-[#060606]">
                        JobHub
                    </span>
                </Link>

                <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">

                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-[#060606]">
                            Create your account
                        </h1>

                        <p className="mt-2 text-sm text-[#4B454F]">
                            Join JobHub and find your next opportunity
                        </p>
                    </div>

                    {error && (
                        <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="mt-7 space-y-5"
                    >

                        {/* Username */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#060606]">
                                Username
                            </label>

                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Your username"
                                required
                                className="w-full rounded-xl border border-black/10 bg-[#F8F8F8] px-4 py-3 text-sm outline-none focus:border-[#0A3ECA]"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#060606]">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                                className="w-full rounded-xl border border-black/10 bg-[#F8F8F8] px-4 py-3 text-sm outline-none focus:border-[#0A3ECA]"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#060606]">
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    required
                                    className="w-full rounded-xl border border-black/10 bg-[#F8F8F8] px-4 py-3 pr-12 text-sm outline-none focus:border-[#0A3ECA]"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4B454F]"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-[#060606]">
                                I am a
                            </label>

                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-black/10 bg-[#F8F8F8] px-4 py-3 text-sm outline-none focus:border-[#0A3ECA]"
                            >
                                <option value="jobseeker">
                                    Job Seeker
                                </option>

                                <option value="recruiter">
                                    Recruiter
                                </option>
                            </select>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-[#0A3ECA] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0835AA] disabled:opacity-60"
                        >
                            {loading
                                ? "Creating account..."
                                : "Create account"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-[#4B454F]">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-[#0A3ECA] hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;