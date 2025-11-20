import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api";
import { Sparkles } from "lucide-react";

export const Register = () => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [role, setrole] = useState("");
  const navigate = useNavigate();

  const handlesubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", { name, email, password, role });

    api
      .post("/register", {
        username: name,
        email,
        password,
        role,
      })
      .then((res) => {
        localStorage.setItem("accessToken", res.data.accessToken);
        toast.success(res.data.message || "Registration Successful!");
        navigate("/login");
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response?.data?.message || "Try again!");
      });

    setname("");
    setpassword("");
    setemail("");
    setrole("");
  };

  return (
    <div className="auth-page">
      <div className="backdrop-orbs">
        <div className="orb one" />
        <div className="orb three" />
      </div>

      <div className="auth-panel">
        <section className="visual">
          <p className="hero-badge">
            <Sparkles size={15} />
            Next-gen campus ops
          </p>
          <h1>Create your account</h1>
          <p>
            Bring hostels, mess partners, and students together on a single white &amp; blue workspace built
            for clarity.
          </p>
        </section>

        <section>
          <h2 className="section-title">Get started</h2>
          <p className="section-subtitle">Tell us who you are to customise your dashboard</p>
          <form className="form" onSubmit={handlesubmit}>
            <div className="form-group">
              <label className="form__label" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                className="form__control"
                placeholder="Full name"
                value={name}
                onChange={(e) => setname(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form__label" htmlFor="reg-email">
                Email
              </label>
              <input
                id="reg-email"
                type="email"
                className="form__control"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form__label" htmlFor="reg-password">
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                className="form__control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form__label" htmlFor="reg-role">
                Role
              </label>
              <select
                id="reg-role"
                className="form__control"
                value={role}
                onChange={(e) => setrole(e.target.value)}
                required
              >
                <option value="">Select role</option>
                <option value="student">Student</option>
                <option value="messowner">Mess owner</option>
                <option value="hostelowner">Hostel owner</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Create account
            </button>
          </form>
          <div className="auth-footer">
            Already registered? <Link to="/login">Sign in</Link>
          </div>
        </section>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};
