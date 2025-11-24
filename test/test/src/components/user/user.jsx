import { NavLink, Outlet, useLocation } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import api from "../../lib/api"
import { UtensilsCrossed, CalendarDays, AlertCircle, CheckCheck } from "lucide-react"

export const User = () => {
    const [isOpen, setIsOpen] = useState(false)
    const userId = localStorage.getItem("Id")
    const location = useLocation()
    const atHome = location.pathname === "/Profile"

    // Summary states
    const [enrolledMess, setEnrolledMess] = useState(null)
    const [enrolledHostel, setEnrolledHostel] = useState(null)
    const DAYS = ["mon","tue","wed","thu","fri","sat","sun"]
    const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay()-1
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
                    } catch (_) {}
                }
                // Menu week
                const w = await api.get('/mess/menu/week')
                setWeek(w.data?.data || {})
            } catch (_) {}
        }
        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const loadCap = async () => {
            try {
                const r = await api.get('/mess/capacity', { params: { day, slot } })
                setCap(r.data?.data || { remaining: 0, total: 0 })
            } catch (_) {}
        }
        loadCap()
    }, [day, slot])

    useEffect(() => {
        const loadBookings = async () => {
            try {
                const r = await api.get('/mess/bookings/my', { params: { userId } })
                setBookings(r.data?.data || [])
            } catch (_) {}
        }
        if (userId) loadBookings()
    }, [userId])

    return (
        <div className="w-screen h-screen min-h-screen flex bg-gradient-to-tr from-emerald-50 via-teal-50 to-cyan-50 overflow-hidden font-sans">
            {/* SIDEBAR */}
            <aside
                className={`
                    fixed md:static top-0 left-0 z-40 flex flex-col h-full w-64 
                    bg-[#111a27] text-white border-r border-slate-200
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0 transition-transform duration-300 ease-in-out
                    shadow-xl md:shadow-none
                `}
            >
                {/* Dashboard Title */}
                <div className="p-5 border-b border-slate-700 text-xl font-semibold text-emerald-300 tracking-wide select-none">
                    Student Dashboard
                    <button
                        className="md:hidden float-right text-lg"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close Menu"
                    >✕</button>
                </div>
                <nav className="flex flex-col p-4 gap-2 flex-1">
                    <NavLink
                        to="Mlist"
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-lg transition-colors ${isActive ? "bg-slate-800 text-white" : "text-slate-200 hover:bg-slate-800"}`
                        }
                    >
                        Mess List
                    </NavLink>
                    <NavLink
                        to="Hlist"
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-lg transition-colors ${isActive ? "bg-slate-800 text-white" : "text-slate-200 hover:bg-slate-800"}`
                        }
                    >
                        Hostel List
                    </NavLink>
                    {enrolledMess && enrolledMess._id && (
                        <NavLink
                            to={`Hlist/${enrolledMess._id}`}
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-lg transition-colors ${isActive ? "bg-slate-800 text-white" : "text-slate-200 hover:bg-slate-800"}`
                            }
                        >
                            My Mess
                        </NavLink>
                    )}
                    {enrolledHostel && enrolledHostel._id && (
                        <NavLink
                            to={`Hlist/${enrolledHostel._id}`}
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-lg transition-colors ${isActive ? "bg-slate-800 text-white" : "text-slate-200 hover:bg-slate-800"}`
                            }
                        >
                            My Hostel
                        </NavLink>
                    )}
                    <NavLink
                        to="msg"
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-lg transition-colors ${isActive ? "bg-slate-800 text-white" : "text-slate-200 hover:bg-slate-800"}`
                        }
                    >
                        Messages
                    </NavLink>
                    <NavLink
                        to="announcements"
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-lg transition-colors ${isActive ? "bg-slate-800 text-white" : "text-slate-200 hover:bg-slate-800"}`
                        }
                    >
                        Announcements
                    </NavLink>
                    <NavLink
                        to="complaints"
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-lg transition-colors ${isActive ? "bg-slate-800 text-white" : "text-slate-200 hover:bg-slate-800"}`
                        }
                    >
                        Complaints
                    </NavLink>
                </nav>
                <div className="px-4 py-3 border-t border-slate-700 text-xs text-center text-slate-400">
                    © 2025 Hostel Admin
                </div>
            </aside>
            {/* MOBILE TOGGLE */}
            <button
                className="md:hidden absolute top-5 left-5 bg-slate-200 text-slate-700 px-3 py-1 rounded shadow hover:bg-slate-300 z-50"
                onClick={() => setIsOpen(true)}
                aria-label="Open Menu"
            >☰</button>
            {/* MAIN CONTENT */}
            <main className={`flex-1 h-full overflow-y-auto flex items-start ${atHome ? 'justify-center p-4 md:p-10' : 'justify-start pt-4 md:pt-10 pr-4 md:pr-10 pb-4 md:pb-10 pl-0 md:pl-0'} md:ml-64 transition-all duration-300`}>
                {atHome ? (
                <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col gap-6">
                    <div className="border-b border-slate-200 pb-4">
                        <div className="text-slate-500 text-sm">Welcome back! Here's what's happening today.</div>
                        <h2 className="mt-1 text-xl md:text-2xl font-semibold text-slate-800">Dashboard</h2>
                    </div>

                    {/* KPI cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 rounded-xl border bg-white border-slate-200 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                <CalendarDays size={20} />
                            </div>
                            <div>
                                <div className="text-xs text-slate-500">Total Hostels</div>
                                <div className="text-xl font-semibold text-slate-800">{enrolledHostel ? 1 : 0}</div>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl border bg-white border-slate-200 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
                                <UtensilsCrossed size={20} />
                            </div>
                            <div>
                                <div className="text-xs text-slate-500">Today's Bookings</div>
                                <div className="text-xl font-semibold text-slate-800">{bookings.length}</div>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl border bg-white border-slate-200 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <div className="text-xs text-slate-500">Pending Complaints</div>
                                <div className="text-xl font-semibold text-slate-800">{pendingComplaints}</div>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl border bg-white border-slate-200 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                <CheckCheck size={20} />
                            </div>
                            <div>
                                <div className="text-xs text-slate-500">Resolved Issues</div>
                                <div className="text-xl font-semibold text-slate-800">{resolvedComplaints}</div>
                            </div>
                        </div>
                    </div>

                    {/* Big sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Today's Mess Menu */}
                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <UtensilsCrossed className="text-slate-600" size={18} />
                                    <h3 className="font-semibold text-slate-800">Today's Mess Menu</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-xs text-slate-500">Day</div>
                                    <select value={day} onChange={(e)=>setDay(e.target.value)} className="px-2 py-1 rounded border border-slate-300 text-xs">
                                        {DAYS.map(d => <option key={d} value={d}>{d.toUpperCase()}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="text-xs text-slate-500 mt-1">Fresh meals prepared for you</div>
                            <div className="mt-3 space-y-3">
                                {['breakfast','lunch','dinner'].map(s => {
                                    const its = week?.[day]?.[s]?.items ?? []
                                    const label = s.charAt(0).toUpperCase()+s.slice(1)
                                    return (
                                        <div key={s} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                            <div className="font-medium text-slate-800">{label}</div>
                                            <div className="text-xs text-slate-600 mt-1">
                                                {its.length ? its.join ? its.join(', ') : its.map(x => typeof x === 'string' ? x : x.name).join(', ') : 'Not set'}
                                            </div>
                                        </div>
                                    )
                                })}
                                {/* Capacity bar for selected slot */}
                                <div className="pt-1">
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <span>Capacity</span>
                                        <select value={slot} onChange={(e)=>setSlot(e.target.value)} className="px-2 py-0.5 rounded border border-slate-300 text-xs">
                                            <option value="breakfast">breakfast</option>
                                            <option value="lunch">lunch</option>
                                            <option value="dinner">dinner</option>
                                        </select>
                                        <span className="ml-auto">{cap.remaining} left / {cap.total}</span>
                                    </div>
                                    <div className="mt-2 h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500" style={{ width: cap.total>0 ? `${Math.min(100, (100*(cap.total-cap.remaining))/cap.total)}%` : '0%' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Complaints */}
                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="text-slate-600" size={18} />
                                <h3 className="font-semibold text-slate-800">Recent Complaints</h3>
                            </div>
                            <div className="text-xs text-slate-500 mt-1">Latest issues reported</div>
                            <div className="mt-4 text-slate-500 text-sm">No complaints yet</div>
                        </div>
                    </div>

                    {/* Enrolled summary cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                            <div className="text-sm text-slate-500 mb-1">Enrolled Mess</div>
                            {enrolledMess ? (
                                <div>
                                    <div className="font-semibold text-slate-800">{enrolledMess.name || '—'}</div>
                                    {enrolledMess.adress && <div className="text-xs text-slate-600 mt-1">{enrolledMess.adress}</div>}
                                    {enrolledMess.price && <div className="text-xs text-slate-600 mt-1">Price: ₹{enrolledMess.price}</div>}
                                </div>
                            ) : (
                                <div className="text-slate-500">Not enrolled</div>
                            )}
                        </div>

                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                            <div className="text-sm text-slate-500 mb-1">Enrolled Hostel</div>
                            {enrolledHostel ? (
                                <div>
                                    <div className="font-semibold text-slate-800">{enrolledHostel.name || '—'}</div>
                                    {enrolledHostel.adress && <div className="text-xs text-slate-600 mt-1">{enrolledHostel.adress}</div>}
                                    {Array.isArray(enrolledHostel.accepted) && <div className="text-xs text-slate-600 mt-1">Members: {enrolledHostel.accepted.length}</div>}
                                </div>
                            ) : (
                                <div className="text-slate-500">Not enrolled</div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        <NavLink to="Mlist" className={({isActive}) => `rounded-xl border p-4 text-center text-sm font-medium transition-all ${isActive? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-emerald-700 hover:bg-emerald-50'}`}>Mess List</NavLink>
                        <NavLink to="Hlist" className={({isActive}) => `rounded-xl border p-4 text-center text-sm font-medium transition-all ${isActive? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-emerald-700 hover:bg-emerald-50'}`}>Hostel List</NavLink>
                        <NavLink to="announcements" className={({isActive}) => `rounded-xl border p-4 text-center text-sm font-medium transition-all ${isActive? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-emerald-700 hover:bg-emerald-50'}`}>Announcements</NavLink>
                        <NavLink to="complaints" className={({isActive}) => `rounded-xl border p-4 text-center text-sm font-medium transition-all ${isActive? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-emerald-700 hover:bg-emerald-50'}`}>Complaints</NavLink>
                        <NavLink to="msg" className={({isActive}) => `rounded-xl border p-4 text-center text-sm font-medium transition-all ${isActive? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-emerald-700 hover:bg-emerald-50'}`}>Messages</NavLink>
                    </div>
                </div>
                ) : (
                    <div className="w-full max-w-7xl">
                        <Outlet />
                    </div>
                )}
            </main>
        </div>
    )
}
