import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      localStorage.setItem("role", res.data.data.role);
      localStorage.setItem("Id", res.data.data.userId);

      toast.success(res.data.message || "Login Successful!");
      navigate("/Profile");

      // ✅ clear fields only on success
      setEmail("");
      setPassword("");

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Invalid credentials!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-10">
        {/* Header */}
        <div className="text-center space-y-1 mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Welcome back</h1>
          <p className="text-sm text-slate-500">Sign in to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
              required
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <Link to="/forgot-password" className="text-xs text-indigo-600 hover:underline">
                Forgot?
              </Link>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition disabled:opacity-50"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="border-t border-slate-200 my-6"></div>

        <Link to="/register">
          <button
            type="button"
            className="w-full py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition font-semibold tracking-wide"
          >
            Create Account
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Login;
