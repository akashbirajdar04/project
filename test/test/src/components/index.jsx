// HostelMessManagement.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { Building2, UtensilsCrossed, Users, ArrowRight, Sparkles } from "lucide-react";

 export const Index = () => {
    const navigate=useNavigate();
  const  handlelogin=()=>{
      navigate('/login')
   }
  const    handleregister=()=>{
        navigate('/register')
    }


  return (
    <div className="page-shell">
      <div className="backdrop-orbs">
        <div className="orb one" />
        <div className="orb two" />
        <div className="orb three" />
      </div>

      <section className="hero">
        <div className="hero-badge">
          <Sparkles size={16} />
          Smart campus living
        </div>
        <h1 className="hero-title">
          Hostel &amp; Mess Management <span className="hero__highlight">made simple</span>
        </h1>
        <p className="hero-subtitle">
          Connect students with verified hostels and curated mess facilities. Handle bookings, meal plans,
          and communication inside a single modern workspace.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={handleregister}>
            Get started <ArrowRight size={18} />
          </button>
          <button className="btn btn-outline" onClick={handlelogin}>
            Sign in
          </button>
        </div>
      </section>

      <section className="feature-grid">
        {[
          {
            icon: <Building2 size={26} />,
            title: "Hostel Management",
            text: "List rooms, track occupancy, and approve student requests with structured workflows."
          },
          {
            icon: <UtensilsCrossed size={26} />,
            title: "Mess Facilities",
            text: "Publish menus, manage subscriptions, and monitor capacity with live insights."
          },
          {
            icon: <Users size={26} />,
            title: "Student Portal",
            text: "Students compare spaces, submit requests, and follow their bookings in real time."
          }
        ].map((item) => (
          <article key={item.title} className="feature-card">
            <div className="feature-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="cta-light">
        <div className="hero-badge">
          <Sparkles size={14} />
          Join thousands of students
        </div>
        <h2>Ready to streamline student living?</h2>
        <p>
          Bring every hostel and mess interaction into one intuitive experience. Launch your account in
          minutes and start inviting admins, owners, and students.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={handleregister}>
            Register now <ArrowRight size={18} />
          </button>
          <button className="btn btn-outline" onClick={handlelogin}>
            Access my account
          </button>
        </div>
      </section>
    </div>
  );
};


