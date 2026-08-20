import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Shield, UserPlus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";

export const Register = () => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [role, setrole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlesubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    axios
      .post(`${import.meta.env.VITE_API_URL || "https://hosteldine.onrender.com"}/register`, {
        username: name,
        email,
        password,
        role,
      })
      .then((res) => {
        localStorage.setItem("accessToken", res.data.accessToken);
        toast.success(res.data.message || "Registration successful!");
        navigate("/login");
      })
      .catch((err) => {
        console.error(err);
        const responseData = err.response?.data;
        if (responseData?.errors && Array.isArray(responseData.errors)) {
          responseData.errors.forEach(errorObj => {
            const msg = Object.values(errorObj)[0];
            toast.error(msg);
          });
        } else {
          toast.error(responseData?.message || "Registration failed!");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex items-center justify-center p-4 md:p-6 animate-fadeIn">
      <Card className="w-full max-w-md bg-white border-slate-200/80 shadow-lg/40 p-0 overflow-hidden">
        <CardHeader className="text-center pb-2 bg-gradient-to-b from-slate-50 to-white pt-8">
          <div className="mx-auto w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-2">
            <UserPlus className="w-5 h-5" />
          </div>
          <CardTitle className="text-xl font-semibold text-slate-900 tracking-tight">Create an account</CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Join CampusLife platform to manage or access services
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-4">
          <form onSubmit={handlesubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                  required
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  required
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  required
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700">Select Role</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Shield className="h-4 w-4" />
                </div>
                <select
                  value={role}
                  onChange={(e) => setrole(e.target.value)}
                  required
                  className="flex h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500 text-slate-800"
                >
                  <option value="">Choose a role</option>
                  <option value="student">Student</option>
                  <option value="messowner">Mess Owner</option>
                  <option value="hostelowner">Hostel Owner</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-full mt-2"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center border-t border-slate-100 py-4 bg-slate-50/50">
          <p className="text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
