import { NavLink, Outlet, useLocation } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import api from "../../lib/api"
import { UtensilsCrossed, CalendarDays, AlertCircle, CheckCheck, Building2, MessageSquare, Megaphone } from "lucide-react"

export const User = () => {
    const userId = localStorage.getItem("Id")
    const location = useLocation()
    const atHome = location.pathname === "/Profile" || location.pathname === "/Profile/"

    // Summary states
    const [enrolledMess, setEnrolledMess] = useState(null)
    const [enrolledHostel, setEnrolledHostel] = useState(null)
    const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
    const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
    const [day, setDay] = useState(DAYS[todayIdx])
    const [slot, setSlot] = useState("lunch")
    const [week, setWeek] = useState({})
    const [cap, setCap] = useState({ remaining: 0, total: 0 })
    const [bookings, setBookings] = useState([])
    const [pendingComplaints, setPendingComplaints] = useState(0)
    const [resolvedComplaints, setResolvedComplaints] = useState(0)

    const items = useMemo(() => week?.[day]?.[slot]?.items ?? [], [week, day, slot])

    useEffect(() => {
        const load = async () => {
            try {
                if (userId) {
                    // Enrolled mess
                    const m = await api.get(`/student/${userId}/mess`)
                    setEnrolledMess(m.data?.data || null)
                    // Enrolled hostel
                    const h = await api.get(`/Profile/student/${userId}/hostel`)
                    const arr = h.data?.data || []
                    setEnrolledHostel(Array.isArray(arr) ? arr[0] || null : null)
                    // Complaints summary (best-effort; endpoints may vary)
                    try {
                        const c = await api.get(`/complaints/my`, { params: { userId } })
                        const list = Array.isArray(c.data?.data) ? c.data.data : []
                        setPendingComplaints(list.filter(x => x.status === 'pending').length)
                        setResolvedComplaints(list.filter(x => x.status === 'resolved').length)
                    } catch (_) { }
                }
                // Menu week
                const w = await api.get('/mess/menu/week')
                setWeek(w.data?.data || {})
            } catch (_) { }
        }
        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const loadCap = async () => {
            try {
                const r = await api.get('/mess/capacity', { params: { day, slot } })
                setCap(r.data?.data || { remaining: 0, total: 0 })
            } catch (_) { }
        }
        loadCap()
    }, [day, slot])

    useEffect(() => {
        const loadBookings = async () => {
            try {
                const r = await api.get('/mess/bookings/my', { params: { userId } })
                setBookings(r.data?.data || [])
            } catch (_) { }
        }
        if (userId) loadBookings()
    }, [userId])

    const handleCancelMess = async () => {
        if (!confirm("Are you sure you want to cancel your mess membership?")) return;
        try {
            // Assuming endpoint to leave mess
            await api.delete(`/student/${userId}/mess`);
            setEnrolledMess(null);
            alert("Membership cancelled");
        } catch (e) {
            console.error(e);
            alert("Failed to cancel membership");
        }
    };

    const handleLeaveHostel = async () => {
        if (!confirm("Are you sure you want to leave your hostel?")) return;
        try {
            // Assuming endpoint to leave hostel
            await api.delete(`/student/${userId}/hostel`);
            setEnrolledHostel(null);
            alert("Left hostel successfully");
        } catch (e) {
            console.error(e);
            alert("Failed to leave hostel");
        }
    };

    if (!atHome) {
        return <Outlet />
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Student Dashboard</h1>
                    <p className="text-slate-500 text-sm mt-1">Welcome back! Here's what's happening today.</p>
                </div>
            </div>

            {/* Enrollment Actions (Visible only if NOT enrolled) */}
            {(!enrolledMess || !enrolledHostel) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {!enrolledMess && (
                        <NavLink to="Mlist" className="group p-6 rounded-xl border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-all flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-blue-900 text-lg">Find a Mess</h3>
                                <p className="text-blue-700 text-sm mt-1">Browse and join a mess facility</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <UtensilsCrossed size={20} />
                            </div>
                        </NavLink>
                    )}
                    {!enrolledHostel && (
                        <NavLink to="Hlist" className="group p-6 rounded-xl border border-indigo-100 bg-indigo-50 hover:bg-indigo-100 transition-all flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-indigo-900 text-lg">Find a Hostel</h3>
                                <p className="text-indigo-700 text-sm mt-1">Browse and join a hostel</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <Building2 size={20} />
                            </div>
                        </NavLink>
                    )}
                </div>
            )}

            {/* My Mess Section (Visible only if enrolled) */}
            {enrolledMess && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <div className="flex items-center gap-2">
                                <UtensilsCrossed className="text-blue-600" size={20} />
                                <h3 className="font-semibold text-slate-800">My Mess: {enrolledMess.name}</h3>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
                                    Active
                                </span>
                                <button onClick={handleCancelMess} className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline">
                                    Cancel Membership
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-medium text-slate-700">Today's Menu ({day.toUpperCase()})</h4>
                                <div className="text-sm text-slate-500">
                                    Off Days Taken: <span className="font-bold text-slate-800">0</span>/4
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {['breakfast', 'lunch', 'dinner'].map(s => {
                                    const its = week?.[day]?.[s]?.items ?? []
                                    const label = s.charAt(0).toUpperCase() + s.slice(1)
                                    return (
                                        <div key={s} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 hover:border-blue-100 transition-colors">
                                            <div className="font-semibold text-slate-800 mb-2 pb-2 border-b border-slate-200">{label}</div>
                                            <div className="text-sm text-slate-600 min-h-[60px]">
                                                {its.length ? (
                                                    <ul className="list-disc pl-4 space-y-1">
                                                        {its.map((x, i) => (
                                                            <li key={i}>{typeof x === 'string' ? x : x.name}</li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <span className="text-slate-400 italic">Not set</span>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats for Mess */}
                    <div className="space-y-4">
                        <div className="p-5 rounded-xl border bg-white border-slate-200 shadow-sm">
                            <div className="text-sm text-slate-500 font-medium mb-1">Monthly Fee</div>
                            <div className="text-2xl font-bold text-slate-800">₹{enrolledMess.price || '0'}</div>
                        </div>
                        <div className="p-5 rounded-xl border bg-white border-slate-200 shadow-sm">
                            <div className="text-sm text-slate-500 font-medium mb-1">Mess Location</div>
                            <div className="text-base font-medium text-slate-800 flex items-start gap-2">
                                <Building2 size={16} className="mt-1 text-slate-400" />
                                {enrolledMess.address || 'No address'}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* My Hostel Section (Visible only if enrolled) */}
            {enrolledHostel && (
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                        <div className="flex items-center gap-2">
                            <Building2 className="text-indigo-600" size={20} />
                            <h3 className="font-semibold text-slate-800">My Hostel: {enrolledHostel.name}</h3>
                        </div>
                        <button onClick={handleLeaveHostel} className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline">
                            Leave Hostel
                        </button>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <div className="text-sm text-slate-500 mb-1">Location</div>
                            <div className="font-medium text-slate-800">{enrolledHostel.address || 'N/A'}</div>
                        </div>
                        <div>
                            <div className="text-sm text-slate-500 mb-1">Contact</div>
                            <div className="font-medium text-slate-800">{enrolledHostel.contact || 'N/A'}</div>
                        </div>
                        <div>
                            <div className="text-sm text-slate-500 mb-1">Status</div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Resident
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* General Dashboard Widgets (Complaints, etc) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl border bg-white border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-yellow-50 text-yellow-600">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <div className="text-sm text-slate-500 font-medium">Pending Complaints</div>
                        <div className="text-lg font-bold text-slate-800">{pendingComplaints}</div>
                    </div>
                </div>
                <div className="p-5 rounded-xl border bg-white border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-green-50 text-green-600">
                        <CheckCheck size={24} />
                    </div>
                    <div>
                        <div className="text-sm text-slate-500 font-medium">Resolved Complaints</div>
                        <div className="text-lg font-bold text-slate-800">{resolvedComplaints}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <NavLink to="announcements" className="p-4 rounded-xl bg-purple-50 border border-purple-100 text-purple-700 hover:bg-purple-100 transition-colors flex flex-col items-center justify-center gap-2 text-center">
                    <Megaphone size={24} />
                    <span className="text-sm font-semibold">Announcements</span>
                </NavLink>
                <NavLink to="msg" className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 hover:bg-blue-100 transition-colors flex flex-col items-center justify-center gap-2 text-center">
                    <MessageSquare size={24} />
                    <span className="text-sm font-semibold">Messages</span>
                </NavLink>
            </div>
        </div>
    )
}
