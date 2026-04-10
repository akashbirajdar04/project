import React from "react";
import { useNavigate } from "react-router-dom";
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



export const Index = () => {
    const navigate = useNavigate();
    const handlelogin = () => {
        navigate('/login')
    }
    const handleregister = () => {
        navigate('/register')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <Home className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 tracking-tight">HostelHub</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handlelogin}
                                className="text-slate-600 hover:text-blue-600 px-4 py-2 text-sm font-medium transition-colors"
                            >
                                Sign in
                            </button>
                            <button
                                onClick={handleregister}
                                className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative overflow-hidden pt-16 pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-8 border border-blue-200">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Smart campus living management
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
                            Simplify Your <span className="text-blue-600">Hostel & Mess</span> Experience
                        </h1>
                        <p className="mt-4 text-xl text-slate-600 mb-10 leading-relaxed">
                            The all-in-one platform for students, hostel owners, and mess managers to connect, manage bookings, and streamline campus life.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                            <button
                                onClick={handleregister}
                                className="px-8 py-4 rounded-full bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-1 flex items-center justify-center"
                            >
                                Start for free <ArrowRight className="ml-2 h-5 w-5" />
                            </button>
                            <button
                                onClick={handlelogin}
                                className="px-8 py-4 rounded-full bg-white text-slate-700 font-bold text-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center"
                            >
                                Existing User?
                            </button>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 animate-pulse"></div>
                            <img
                                src="/hero.webp"
                                alt="HostelHub Dashboard Preview"
                                className="relative rounded-2xl shadow-2xl border border-slate-200 w-full"
                                fetchPriority="high"
                                loading="eager"
                                width={1200}
                                height={675}
                            />
                        </div>



                    </div>
                </div>

                {/* Decorative blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="bg-white py-24 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Whether you're a student looking for accommodation or an owner managing facilities, we've got you covered.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1 group">
                            <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                                <Building2 className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Hostel Management</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Seamlessly manage room allocations, track occupancy, and handle student requests with our intuitive dashboard.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1 group">
                            <div className="w-14 h-14 rounded-xl bg-orange-500 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                                <UtensilsCrossed className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Mess Services</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Digitize your menu, manage daily bookings, and track food capacity to reduce wastage and improve service.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1 group">
                            <div className="w-14 h-14 rounded-xl bg-green-500 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                                <Users className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Student Community</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Connect with peers, raise complaints, and stay updated with announcements in real-time.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-300 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <Home className="h-6 w-6 text-blue-500" />
                                <span className="text-xl font-bold text-white">HostelHub</span>
                            </div>
                            <p className="text-slate-400 max-w-sm">
                                Making campus life easier, one click at a time. Join thousands of students and owners today.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Platform</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Support</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500">
                        © 2024 HostelHub. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};
