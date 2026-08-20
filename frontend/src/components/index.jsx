import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Building2,
    UtensilsCrossed,
    Users,
    ArrowRight,
    Sparkles,
    Home,
    Shield,
    CheckCircle2
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";

export const Index = () => {
    const navigate = useNavigate();
    const handlelogin = () => navigate('/login');
    const handleregister = () => navigate('/register');

    return (
        <div className="min-h-screen bg-slate-50/60 font-sans text-slate-900 animate-fadeIn">
            {/* Header / Navbar */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-xs">
                                CL
                            </div>
                            <span className="text-lg font-semibold tracking-tight text-slate-900">CampusLife</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Button variant="ghost" size="sm" onClick={handlelogin}>
                                Sign in
                            </Button>
                            <Button variant="primary" size="sm" onClick={handleregister}>
                                Get Started
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-16 pb-20 md:pt-24 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-medium text-indigo-700 mb-6">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Smart Campus Living Solution</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900 mb-6 leading-tight">
                        Modern platform for <span className="text-indigo-600 font-bold">Hostel & Mess</span> management
                    </h1>

                    <p className="text-base md:text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
                        Unified hub for students, hostel administrators, and mess facilities to manage requests, announcements, and daily campus living.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-3 mb-14">
                        <Button size="lg" variant="primary" onClick={handleregister} className="gap-2">
                            Get Started Free <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button size="lg" variant="outline" onClick={handlelogin}>
                            Sign In to Portal
                        </Button>
                    </div>

                    <div className="relative rounded-2xl p-2 bg-white border border-slate-200/80 shadow-xl">
                        <img
                            src="/hero.webp"
                            alt="CampusLife Dashboard Preview"
                            className="rounded-xl border border-slate-100 w-full"
                            fetchPriority="high"
                            loading="eager"
                            width={1200}
                            height={675}
                        />
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="bg-white py-20 border-t border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <Badge variant="secondary" className="mb-3">Features</Badge>
                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight mb-3">
                            Tailored for your campus workflow
                        </h2>
                        <p className="text-sm text-slate-500">
                            Dedicated features for students, mess managers, and hostel administrators.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="hover:border-indigo-200 transition-all">
                            <CardHeader>
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-2">
                                    <Building2 className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-lg font-semibold">Hostel Management</CardTitle>
                                <CardDescription className="text-xs">
                                    Efficiently manage room allocations, track structures, and resolve tenant requests smoothly.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="hover:border-indigo-200 transition-all">
                            <CardHeader>
                                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-2">
                                    <UtensilsCrossed className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-lg font-semibold">Mess Facilities</CardTitle>
                                <CardDescription className="text-xs">
                                    Publish weekly menus, manage meal passes, track feedback, and streamline dining capacity.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="hover:border-indigo-200 transition-all">
                            <CardHeader>
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                                    <Users className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-lg font-semibold">Student Community</CardTitle>
                                <CardDescription className="text-xs">
                                    Find roommates, post lost & found notices, answer polls, and receive campus announcements.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-300 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-semibold text-xs">
                                CL
                            </div>
                            <span className="text-base font-semibold text-white tracking-tight">CampusLife</span>
                        </div>
                        <p className="text-xs text-slate-400">
                            © 2026 CampusLife Portal. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Index;
