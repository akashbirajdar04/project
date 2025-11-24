import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [role, setrole] = useState("");
  const navigate = useNavigate();

  const handlesubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", { name, email, password, role });

    axios
      .post("http://localhost:3000/register", {
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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 font-sans px-4">
      <form
        onSubmit={handlesubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-10 space-y-5"
      >
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">Create your account</h2>
          <p className="text-sm text-slate-500">Join the platform to manage hostels and mess services</p>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">Name</label>
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setname(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 transition"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">Role</label>
          <select
            value={role}
            onChange={(e) => setrole(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-white text-slate-900 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
          >
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="messowner">Mess Owner</option>
            <option value="hostelowner">Hostel Owner</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition"
        >
          Create account
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};
