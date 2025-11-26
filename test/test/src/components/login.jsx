import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Lock, Mail } from "lucide-react";

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
      localStorage.setItem("accessToken", res.data.data.accessToken); // Ensure token is saved if returned

      toast.success(res.data.message || "Login Successful!");
      navigate("/Profile");

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">
        {/* Left side - Welcome Section */}
        <div className="bg-blue-600 text-white p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto">
            <div className="inline-flex items-center space-x-2 mb-2 text-blue-100">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium">Welcome back</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Access your dashboard</h1>
            <p className="text-blue-100 mb-8">
              Manage hostels, mess facilities, and student requests from one modern control center.
            </p>
            <div className="hidden md:block">
              <div className="h-1 w-16 bg-blue-400 mb-6"></div>
              <div className="flex space-x-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Secure Access</h3>
                  <p className="text-sm text-blue-100">Your data is protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="p-8 md:p-12 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center md:text-left mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign in to your account</h2>
              <p className="text-slate-600">Use your registered account to continue</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-slate-600">
                New to the platform?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
