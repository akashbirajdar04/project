// App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages / Components
import { Login } from "./components/login.jsx";
import { Register } from "./assets/register.jsx";
import { Profile } from "./components/Profile.jsx";
import Layout from "./components/Layout.jsx";

// Hostel
import { Hostel } from "./components/hostel/hostel.jsx";
import { Hostelprofile } from "./components/hostel/hostelprofile.jsx";
import { Hostelrequest } from "./components/hostel/hostelrequests.jsx";
import { Message as HostelMessage } from "./components/hostel/messege.jsx";
import HostelStructure from "./components/hostel/structure.jsx";
import HostelAllocation from "./components/hostel/allocation.jsx";

// Mess
import { Mess } from "./components/mess/mess.jsx";
import { Messprofile } from "./components/mess/messprofile.jsx";
import { Messrequest } from "./components/mess/messrequest.jsx";
import MessMenuManage from "./components/mess/menu-manage.jsx";
import AcceptedMembers from "./components/mess/accepted.jsx";

// User
import { Mlist } from "./components/user/mlist.jsx";
import { Hlist } from "./components/user/Hlist.jsx";
import { User } from "./components/user/user.jsx";
import Req from "./components/user/req.jsx";
import { MessReq } from "./components/user/mess_req.jsx";
import { Acceptedreq } from "./components/user/acepted_req.jsx";
import { Msg } from "./components/user/msg.jsx";
import MenuView from "./components/user/menu.jsx";
import StudentProfile from "./components/user/profile.jsx";
import { Index } from "./components/index.jsx";
import { Announcements } from "./components/announcements.jsx";
import { Complaints } from "./components/complaints.jsx";
import { AdminDashboard } from "./components/admin/AdminDashboard.jsx";
// Chat
import { PrivateChat } from "./soc.jsx";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected App area */}
      <Route element={<Layout />}>
        <Route path="/Profile" element={<Profile />}>
          {/* Mess owner routes */}
          <Route path="Messrequests" element={<Messrequest />} />
          <Route path="Messprofile" element={<Messprofile />} />
          <Route path="mess-menu" element={<MessMenuManage />} />
          <Route path="Messaccepted" element={<AcceptedMembers />} />
          <Route path="Mlist" element={<Mlist />} />

          {/* Hostel owner routes */}
          <Route path="profile" element={<Hostelprofile />} />
          <Route path="requests" element={<Hostelrequest />} />
          <Route path="acceptedreq" element={<Acceptedreq />} />
          <Route path="hostel-structure" element={<HostelStructure />} />
          <Route path="hostel-allocation" element={<HostelAllocation />} />

          {/* Hostel/Mlist specific pages */}
          <Route path="Hlist" element={<Hlist />} />
          <Route path="Hlist/:id" element={<Req />} />
          <Route path="Mlist/:id" element={<MessReq />} />

          {/* Messages for hostel owners */}
          <Route path="messege" element={<HostelMessage />}>
            <Route path="chat/:userId" element={<PrivateChat />} />
          </Route>

          {/* Generic student pages */}
          <Route path="msg" element={<Msg />}>
            <Route path="chat/:userId" element={<PrivateChat />} />
          </Route>
          <Route path="menu" element={<MenuView />} />
          <Route path="student-profile" element={<StudentProfile />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">404 — Page not found</h2>
      </div>} />
    </Routes>
  );
}

export default App;
