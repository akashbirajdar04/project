// App.jsx
import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Loading } from "./components/ui/Loading.jsx";

// Pages / Components (Lazy Loaded)
const Login = React.lazy(() => import("./components/login.jsx").then(module => ({ default: module.Login })));
const Register = React.lazy(() => import("./assets/register.jsx").then(module => ({ default: module.Register })));
const Profile = React.lazy(() => import("./components/Profile.jsx").then(module => ({ default: module.Profile })));
const Layout = React.lazy(() => import("./components/Layout.jsx")); // Default export

// Hostel
const Hostel = React.lazy(() => import("./components/hostel/hostel.jsx").then(module => ({ default: module.Hostel })));
const Hostelprofile = React.lazy(() => import("./components/hostel/hostelprofile.jsx").then(module => ({ default: module.Hostelprofile })));
const Hostelrequest = React.lazy(() => import("./components/hostel/hostelrequests.jsx").then(module => ({ default: module.Hostelrequest })));
const HostelMessage = React.lazy(() => import("./components/hostel/messege.jsx").then(module => ({ default: module.Message })));
const HostelStructure = React.lazy(() => import("./components/hostel/structure.jsx")); // Default export
const HostelAllocation = React.lazy(() => import("./components/hostel/allocation.jsx")); // Default export

// Mess
const Mess = React.lazy(() => import("./components/mess/mess.jsx").then(module => ({ default: module.Mess })));
const Messprofile = React.lazy(() => import("./components/mess/messprofile.jsx").then(module => ({ default: module.Messprofile })));
const Messrequest = React.lazy(() => import("./components/mess/messrequest.jsx").then(module => ({ default: module.Messrequest })));
const MessMenuManage = React.lazy(() => import("./components/mess/menu-manage.jsx")); // Default export
const AcceptedMembers = React.lazy(() => import("./components/mess/accepted.jsx")); // Default export

// User
const Mlist = React.lazy(() => import("./components/user/mlist.jsx").then(module => ({ default: module.Mlist })));
const Hlist = React.lazy(() => import("./components/user/Hlist.jsx").then(module => ({ default: module.Hlist })));
const User = React.lazy(() => import("./components/user/user.jsx").then(module => ({ default: module.User })));
const Req = React.lazy(() => import("./components/user/req.jsx")); // Default export
const MessReq = React.lazy(() => import("./components/user/mess_req.jsx").then(module => ({ default: module.MessReq })));
const Acceptedreq = React.lazy(() => import("./components/user/acepted_req.jsx").then(module => ({ default: module.Acceptedreq })));
const Msg = React.lazy(() => import("./components/user/msg.jsx").then(module => ({ default: module.Msg })));
const MenuView = React.lazy(() => import("./components/user/menu.jsx")); // Default export
const StudentProfile = React.lazy(() => import("./components/user/profile.jsx")); // Default export
const Index = React.lazy(() => import("./components/index.jsx").then(module => ({ default: module.Index })));
const Announcements = React.lazy(() => import("./components/announcements.jsx").then(module => ({ default: module.Announcements })));
const Complaints = React.lazy(() => import("./components/complaints.jsx").then(module => ({ default: module.Complaints })));
const AdminDashboard = React.lazy(() => import("./components/admin/AdminDashboard.jsx").then(module => ({ default: module.AdminDashboard })));

// Chat / Community
const PrivateChat = React.lazy(() => import("./soc.jsx").then(module => ({ default: module.PrivateChat })));
const RoommateFinder = React.lazy(() => import("./components/community/RoommateFinder.jsx").then(module => ({ default: module.RoommateFinder })));
const LostFound = React.lazy(() => import("./components/community/LostFound.jsx").then(module => ({ default: module.LostFound })));
const MealFeedback = React.lazy(() => import("./components/mess/MealFeedback.jsx").then(module => ({ default: module.MealFeedback })));
const StudentList = React.lazy(() => import("./components/community/StudentList.jsx").then(module => ({ default: module.StudentList })));
const PollList = React.lazy(() => import("./components/polls/PollList.jsx")); // Default export

function App() {
  return (
    <Suspense fallback={<Loading />}>
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
            <Route path="roommate-finder" element={<RoommateFinder />} />
            <Route path="lost-found" element={<LostFound />} />
            <Route path="meal-feedback" element={<MealFeedback />} />
            <Route path="students" element={<StudentList />} />
            <Route path="polls" element={<PollList />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<div className="min-h-screen flex items-center justify-center">
          <h2 className="text-xl font-semibold">404 — Page not found</h2>
        </div>} />
      </Routes>
    </Suspense>
  );
}

export default App;
