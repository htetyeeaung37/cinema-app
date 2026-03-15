"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff, CheckCircle } from "lucide-react";
import Link from "next/link";

// ─── Toast Component ───────────────────────────────────────────────────────────
function Toast({ message, onClose }) {
  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border text-sm font-semibold animate-in slide-in-from-top-2 duration-300 bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
      <CheckCircle size={18} />
      {message}
      <button
        onClick={onClose}
        className="ml-2 opacity-60 hover:opacity-100 transition-opacity text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}

// ─── Main LoginForm ────────────────────────────────────────────────────────────
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://cinema-app-iota.vercel.app/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      login(data.token, data.user);
      setToast(true);
      setTimeout(() => {
        setToast(false);
        router.push("/");
      }, 1500);
    } catch (err) {
      setError("Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message="Login successful! Welcome back 🎉"
          onClose={() => setToast(false)}
        />
      )}

      <div className="w-full max-w-md animate-in fade-in duration-700">
        <div className="bg-[#1E293B]/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-slate-700/50">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
              Welcome <span className="text-amber-400">Back</span>
            </h1>
            <p className="text-slate-400 font-medium">
              Sign in to your JCGV account
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm animate-shake">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-slate-300 text-sm font-semibold ml-1">
                Your Email
              </label>
              <div className="mt-1.5 relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-amber-400 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-900/50 text-white border border-slate-700 focus:border-amber-400 outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-slate-300 text-sm font-semibold">
                  Your Password
                </label>
                {/* <Link
                  href="#"
                  className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Forgot Password?
                </Link> */}
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-amber-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-slate-900/50 text-white border border-slate-700 focus:border-amber-400 outline-none transition-all placeholder:text-slate-600"
                />
                {/* Show/Hide Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-amber-400 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 font-bold rounded-2xl shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 group transition-all active:scale-95 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  Sign In
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
            <p className="text-slate-400 text-sm font-medium">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-amber-400 hover:text-amber-300 font-bold transition-all"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}