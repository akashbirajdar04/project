import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || "https://hosteldine.onrender.com"}/login`, {
        email,
        password,
      });

      localStorage.setItem("role", res.data.data.role);
      localStorage.setItem("Id", res.data.data.userId);
      localStorage.setItem("accessToken", res.data.data.accessToken);

      toast.success(res.data.message || "Welcome back!");
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
    <div className="min-h-screen bg-slate-50/60 flex items-center justify-center p-4 md:p-6 animate-fadeIn">
      <Card className="w-full max-w-4xl overflow-hidden border-slate-200/80 shadow-lg/40 grid md:grid-cols-5 p-0">
        {/* Left side - Welcome Section */}
        <div className="md:col-span-2 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-8 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-indigo-200 mb-6 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Management</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-3">
              CampusLife Portal
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Streamlined dashboard for students, hostel administrators, and mess facilities.
            </p>
          </div>

          <div className="mt-8 space-y-4 border-t border-white/10 pt-6">
            <div className="flex items-center space-x-3 text-xs text-slate-300">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-indigo-300 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium text-white">Secure Authentication</p>
                <p className="text-slate-400">Encrypted role-based access</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-center bg-white">
          <div className="w-full max-w-sm mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">Sign in</h2>
              <p className="text-sm text-slate-500 mt-1">Enter your credentials to access your account</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-medium text-slate-700">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    placeholder="name@university.edu"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-xs font-medium text-slate-700">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="w-full mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></span>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign in <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
