import React from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< Updated upstream
=======
import { 
  Building2, 
  UtensilsCrossed, 
  Users, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2,
  Home,
  Utensils,
  User
} from "lucide-react";
>>>>>>> Stashed changes

 export const Index = () => {
    const navigate=useNavigate();
  const  handlelogin=()=>{
      navigate('/login')
   }
  const    handleregister=()=>{
        navigate('/register')
    }


  return (
<<<<<<< Updated upstream
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
=======
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">HostelHub</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handlelogin}
                className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
              >
                Sign in
              </button>
              <button
                onClick={handleregister}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-4xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mb-6">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Smart campus living
                </div>
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Hostel & Mess Management</span>
                  <span className="block text-indigo-600">made simple</span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                  Connect students with verified hostels and curated mess facilities. Handle bookings, meal plans,
                  and communication inside a single modern workspace.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                  <button
                    onClick={handleregister}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Get started
                    <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
                  </button>
                  <button
                    onClick={handlelogin}
                    className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Sign in
                  </button>
                </div>
              </div>
            </main>
          </div>
>>>>>>> Stashed changes
        </div>
      </div>

      {/* Features Section */}
<<<<<<< Updated upstream
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
=======
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for better campus living
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <Building2 className="h-10 w-10 text-indigo-600" />,
                  title: "Hostel Management",
                  description: "List rooms, track occupancy, and approve student requests with structured workflows.",
                  features: [
                    "Room management",
                    "Booking system",
                    "Maintenance requests"
                  ]
                },
                {
                  icon: <Utensils className="h-10 w-10 text-indigo-600" />,
                  title: "Mess Facilities",
                  description: "Publish menus, manage subscriptions, and monitor capacity with live insights.",
                  features: [
                    "Meal planning",
                    "Subscription management",
                    "Feedback system"
                  ]
                },
                {
                  icon: <User className="h-10 w-10 text-indigo-600" />,
                  title: "Student Portal",
                  description: "Students compare spaces, submit requests, and follow their bookings in real time.",
                  features: [
                    "Easy booking",
                    "Real-time updates",
                    "24/7 support"
                  ]
                }
              ].map((feature, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
                  <div className="h-12 w-12 rounded-md bg-indigo-50 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-4xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mb-6">
            <Sparkles className="mr-2 h-4 w-4" />
            Join thousands of students
          </div>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to streamline student living?
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Bring every hostel and mess interaction into one intuitive experience. Launch your account in
            minutes and start inviting admins, owners, and students.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={handleregister}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-indigo-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            >
              Register now
              <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
            </button>
            <button
              onClick={handlelogin}
              className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-lg text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Access my account
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-500">
            &copy; {new Date().getFullYear()} HostelHub. All rights reserved.
          </p>
        </div>
      </footer>
>>>>>>> Stashed changes
    </div>
  );
};


