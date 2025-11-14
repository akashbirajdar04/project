import { User } from "./user/user.jsx";
import { Mess } from "./mess/mess.jsx";
import { Hostel } from "./hostel/hostel.jsx";

export const Profile = () => {
  const role = localStorage.getItem("role");

  let Component;
  if (role === "student") Component = User;
  else if (role === "messowner") Component = Mess;
  else if (role === "hostelowner") Component = Hostel;
  else return <div className="text-center mt-20 text-red-500 text-xl font-semibold">404 – Role not found</div>;

  const RenderComponent = Component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex flex-col items-stretch justify-start p-0 font-sans">
      <RenderComponent />
    </div>
  );
};
