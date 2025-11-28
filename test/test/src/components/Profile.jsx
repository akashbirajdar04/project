import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from "./user/user.jsx";
import { Mess } from "./mess/mess.jsx";
import { Hostel } from "./hostel/hostel.jsx";
import { AdminDashboard } from "./admin/AdminDashboard.jsx";

export const Profile = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    // Check if user is authenticated
    if (!token) {
      toast.error('Please log in to access this page');
      navigate('/login');
    }
  }, [navigate, token]);

  // Get the appropriate component based on user role
  const getComponent = () => {
    switch (role) {
      case 'student':
        return <User />;
      case 'messowner':
        return <Mess />;
      case 'hostelowner':
        return <Hostel />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="mt-4 text-2xl font-bold text-slate-900">Role Not Found</h2>
              <p className="mt-2 text-slate-600">
                The system couldn't determine your user role. Please contact support.
              </p>
              <button
                onClick={() => {
                  localStorage.clear();
                  navigate('/login');
                }}
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Login
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full">
      {getComponent()}
    </div>
  );
};
