import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setError("");
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError("Please enter your email and password.");
            return;
        }

        try {

            setLoading(true);
            setError("");

            const response = await api.post(
                "/api/auth/login",
                formData
            );

            console.log("Login response:", response.data);

            login(
    response.data.token,
    response.data.name
);

            navigate("/dashboard");

        } catch (error) {

            console.error("Login error:", error);

            setError(
                "Invalid email or password. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">

            <div className="w-full max-w-5xl grid md:grid-cols-2 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">

                {/* Left Branding Section */}

                <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600">

                    <div>

                        <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                                ✦
                            </div>

                            <span className="text-2xl font-bold">
                                TaskPilot
                            </span>

                        </div>

                        <div className="mt-20">

                            <p className="text-sm uppercase tracking-[0.3em] text-white/70">
                                AI Powered Productivity
                            </p>

                            <h1 className="mt-4 text-5xl font-bold leading-tight">
                                Turn tasks
                                <br />
                                into progress.
                            </h1>

                            <p className="mt-6 text-white/80 text-lg max-w-md">
                                Organize your work, prioritize what matters,
                                and let AI help you plan smarter.
                            </p>

                        </div>

                    </div>

                    <div className="grid grid-cols-3 gap-3">

                        <div className="rounded-2xl bg-white/10 p-4">
                            <div className="text-xl">✨</div>
                            <p className="mt-2 text-sm font-medium">
                                AI Assist
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white/10 p-4">
                            <div className="text-xl">🎯</div>
                            <p className="mt-2 text-sm font-medium">
                                Smart Tasks
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white/10 p-4">
                            <div className="text-xl">📊</div>
                            <p className="mt-2 text-sm font-medium">
                                Track Progress
                            </p>
                        </div>

                    </div>

                </div>

                {/* Login Section */}

                <div className="p-8 md:p-12 bg-slate-900/80">

                    <div className="max-w-md mx-auto">

                        <div className="mb-10">

                            <p className="text-indigo-400 text-sm font-semibold">
                                WELCOME BACK
                            </p>

                            <h2 className="mt-2 text-3xl font-bold">
                                Sign in to TaskPilot
                            </h2>

                            <p className="mt-3 text-slate-400">
                                Continue where you left off.
                            </p>

                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >

                            {/* Email */}

                            <div>

                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Email address
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                />

                            </div>

                            {/* Password */}

                            <div>

                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                />

                            </div>

                            {/* Error */}

                            {error && (

                                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                    ⚠ {error}
                                </div>

                            )}

                            {/* Button */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3.5 font-semibold transition hover:from-indigo-400 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                {loading
                                    ? "Signing you in..."
                                    : "Sign In →"
                                }

                            </button>

                        </form>

                        <div className="mt-8 text-center text-sm text-slate-400">

                            Don't have an account?{" "}

                            <Link
                                to="/register"
                                className="font-semibold text-indigo-400 hover:text-indigo-300"
                            >
                                Create one
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;