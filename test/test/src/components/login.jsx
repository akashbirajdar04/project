import { useState } from "react";
import api from "../lib/api";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post("/login", {
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
    <div className="auth-page">
      <div className="backdrop-orbs">
        <div className="orb one" />
        <div className="orb two" />
      </div>

      <div className="auth-panel">
        <section className="visual">
          <p className="hero-badge">
            <Sparkles size={16} />
            Welcome back
          </p>
          <h1>Access your dashboard</h1>
          <p>
            Manage hostels, mess facilities, and student requests from one modern control centre built for
            clarity.
          </p>
        </section>

        <section>
          <h2 className="section-title">Sign in</h2>
          <p className="section-subtitle">Use your registered account to continue</p>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form__label" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                className="form__control"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <div className="flex flex--between">
                <label className="form__label" htmlFor="password">
                  Password
                </label>
                <Link to="/forgot-password" className="badge-info">
                  Forgot?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                className="form__control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <div className="auth-footer">
            New to the platform? <Link to="/register">Create an account</Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;
