import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
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

        if (
            !formData.name ||
            !formData.email ||
            !formData.password
        ) {
            setError("Please fill in all fields.");
            return;
        }

const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;

if (!passwordRegex.test(formData.password)) {

    setError(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
    );

    return;
}

        try {

            setLoading(true);
            setError("");

            await api.post(
                "/api/auth/register",
                formData
            );

            setSuccess(
                "Account created successfully! Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1200);

        } catch (error) {

            console.error("Registration error:", error);

            if (error.response?.status === 409) {
                setError("An account with this email already exists.");
            } else {
                setError(
                    error.response?.data?.message ||
                    "Registration failed. Please try again."
                );
            }

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-10">

            <div className="w-full max-w-5xl grid md:grid-cols-2 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">

                {/* Branding */}

                <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600">

                    <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                            ✦
                        </div>

                        <span className="text-2xl font-bold">
                            TaskPilot
                        </span>

                    </div>

                    <h1 className="mt-16 text-5xl font-bold leading-tight">
                        Build your
                        <br />
                        momentum.
                    </h1>

                    <p className="mt-6 text-white/80 text-lg max-w-md">
                        Create tasks, stay focused, and use AI to
                        turn ideas into actionable work.
                    </p>

                    <div className="mt-10 space-y-4">

                        <div className="flex items-center gap-3">
                            <span>✓</span>
                            <span>AI-assisted task creation</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <span>✓</span>
                            <span>Smart priority suggestions</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <span>✓</span>
                            <span>Personal productivity tracking</span>
                        </div>

                    </div>

                </div>

                {/* Register */}

                <div className="p-8 md:p-12 bg-slate-900/80">

                    <div className="max-w-md mx-auto">

                        <div className="mb-8">

                            <p className="text-indigo-400 text-sm font-semibold">
                                GET STARTED
                            </p>

                            <h2 className="mt-2 text-3xl font-bold">
                                Create your account
                            </h2>

                            <p className="mt-3 text-slate-400">
                                Start organizing your work with AI.
                            </p>

                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            <div>

                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Full name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your name"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                />

                            </div>

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
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                />

                            </div>

                            <div>

                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Password
                                </label>

                                <p className="mt-2 text-xs text-slate-400">
    Must contain 8+ characters, uppercase,
    lowercase, number and special character.
</p>

                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password123!"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                />

                            </div>

                            {error && (

                                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                    ⚠ {error}
                                </div>

                            )}

                            {success && (

                                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                                    ✓ {success}
                                </div>

                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3.5 font-semibold transition hover:from-indigo-400 hover:to-purple-500 disabled:opacity-60"
                            >

                                {loading
                                    ? "Creating account..."
                                    : "Create Account →"
                                }

                            </button>

                        </form>

                        <div className="mt-7 text-center text-sm text-slate-400">

                            Already have an account?{" "}

                            <Link
                                to="/login"
                                className="font-semibold text-indigo-400 hover:text-indigo-300"
                            >
                                Sign in
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;