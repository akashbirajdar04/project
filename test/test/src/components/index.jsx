// HostelMessManagement.js
import React from "react";
import { useNavigate } from "react-router-dom";

 export const Index = () => {
    const navigate=useNavigate();
  const  handlelogin=()=>{
      navigate('/login')
   }
  const    handleregister=()=>{
        navigate('/register')
    }


  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center">
      {/* Header Section */}
      <div className="text-center mt-24 mb-10">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-indigo-200 rounded-xl flex items-center justify-center">
            {/* Icon goes here */}
          </div>
        </div>
        <h1 className="text-5xl font-bold text-indigo-600 mb-4">Hostel & Mess Management</h1>
        <p className="text-lg text-gray-600 mb-8">Connect students with hostels and mess facilities. Manage requests, bookings, and communications all in one place.</p>
        <div className="flex justify-center gap-4">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-lg transition font-semibold">Get Started</button>
          <button  onClick={handleregister} className="bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700 px-6 py-2 rounded-lg text-lg font-semibold">Create Account</button>
        </div>
      </div>

      {/* Features Section */}
      <div className="flex justify-center gap-8 mb-16 w-full max-w-5xl">
        <div className="bg-white shadow rounded-xl p-8 flex-1 flex flex-col items-center">
          <div className="mb-6 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center"></div>
          <h2 className="text-2xl font-bold mb-3">Hostel Management</h2>
          <p className="text-gray-600 text-center">List and manage hostel accommodations with ease. Track room availability and handle requests.</p>
        </div>
        <div className="bg-white shadow rounded-xl p-8 flex-1 flex flex-col items-center">
          <div className="mb-6 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
            <span className="text-2xl">🍲</span>
          </div>
          <h2 className="text-2xl font-bold mb-3">Mess Facilities</h2>
          <p className="text-gray-600 text-center">Connect students with mess services. Manage meal plans and subscriptions efficiently.</p>
        </div>
        <div className="bg-white shadow rounded-xl p-8 flex-1 flex flex-col items-center">
          <div className="mb-6 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center"></div>
          <h2 className="text-2xl font-bold mb-3">Student Portal</h2>
          <p className="text-gray-600 text-center">Browse available hostels and mess options. Send requests and manage bookings in real-time.</p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="w-full flex flex-col items-center mb-24">
        <h2 className="text-3xl font-bold mb-3">Ready to Get Started?</h2>
        <p className="text-gray-700 mb-8">Join our platform today and experience seamless hostel and mess management.</p>
        <div className="flex gap-4">
          <button onClick={handleregister} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-lg transition font-semibold">Register Now</button>
          <button onClick={handlelogin} className="bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700 px-6 py-2 rounded-lg text-lg font-semibold">Sign In</button>
        </div>
      </div>
    </div>
  );
};


