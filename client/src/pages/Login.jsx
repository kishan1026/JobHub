import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { setUser } = useAuth();

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
                "http://localhost:3000/api/users/login",
                formData,
                {
                    withCredentials: true,
                }
            );

            console.log("Login successful:", response.data);
            setUser(response.data.user);
            
            const role = response.data.user.role;
            
            if (role === "recruiter" || role === "admin") {
                navigate("/recruiter/dashboard");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Login Error:", error);

            setError(
                error.response?.data?.message ||
                    "Invalid email or password"
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

                {/* Card */}
                <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">

                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-[#060606]">
                            Welcome back
                        </h1>

                        <p className="mt-2 text-sm text-[#4B454F]">
                            Sign in to continue to JobHub
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="mt-7 space-y-5"
                    >

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
                                className="w-full rounded-xl border border-black/10 bg-[#F8F8F8] px-4 py-3 text-sm outline-none transition focus:border-[#0A3ECA]"
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
                                    placeholder="Enter your password"
                                    required
                                    className="w-full rounded-xl border border-black/10 bg-[#F8F8F8] px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#0A3ECA]"
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

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-[#0A3ECA] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0835AA] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign in"}
                        </button>
                    </form>

                    {/* Register */}
                    <p className="mt-6 text-center text-sm text-[#4B454F]">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-[#0A3ECA] hover:underline"
                        >
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;