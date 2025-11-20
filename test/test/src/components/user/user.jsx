import { NavLink, Outlet, useLocation } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import api from "../../lib/api"
import { UtensilsCrossed, CalendarDays, AlertCircle, CheckCheck, Building2, Users, MessageSquare, Bell, FileText } from "lucide-react"

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

    const navClass = ({ isActive }) =>
        `sidebar__link${isActive ? " sidebar__link--active" : ""}`

    return (
        <div className="app-shell">
            <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
                Menu
            </button>
            <aside className={`sidebar ${isOpen ? "is-open" : ""}`}>
                <div className="sidebar__brand">
                    <div className="pill">
                        <Users size={18} /> Student Hub
                    </div>
                </div>
                <nav className="sidebar__nav">
                    <NavLink to="Mlist" className={navClass}>
                        <UtensilsCrossed size={18} /> Mess List
                    </NavLink>
                    <NavLink to="Hlist" className={navClass}>
                        <Building2 size={18} /> Hostel List
                    </NavLink>
                    {enrolledMess?._id && (
                        <NavLink to={`Hlist/${enrolledMess._id}`} className={navClass}>
                            <UtensilsCrossed size={18} /> My Mess
                        </NavLink>
                    )}
                    {enrolledHostel?._id && (
                        <NavLink to={`Hlist/${enrolledHostel._id}`} className={navClass}>
                            <Building2 size={18} /> My Hostel
                        </NavLink>
                    )}
                    <NavLink to="msg" className={navClass}>
                        <MessageSquare size={18} /> Messages
                    </NavLink>
                    <NavLink to="announcements" className={navClass}>
                        <Bell size={18} /> Announcements
                    </NavLink>
                    <NavLink to="complaints" className={navClass}>
                        <FileText size={18} /> Complaints
                    </NavLink>
                </nav>
                <div className="footer-note">© 2025 Hostel Admin</div>
            </aside>

            <main className="content">
                {atHome ? (
                    <div className="dashboard-grid">
                        <section className="hero-panel">
                            <p className="section-subtitle">Welcome back! Here is today’s snapshot.</p>
                            <h2 className="section-title">Student dashboard</h2>
                        </section>

                        <div className="kpi-grid">
                            <article className="kpi-card kpi-purple">
                                <div>
                                    <p className="kpi-label">Total Hostels</p>
                                    <p className="kpi-card__value">{enrolledHostel ? 1 : 0}</p>
                                </div>
                                <Building2 size={32} />
                            </article>
                            <article className="kpi-card kpi-green">
                                <div>
                                    <p className="kpi-label">Today’s bookings</p>
                                    <p className="kpi-card__value">{bookings.length}</p>
                                </div>
                                <UtensilsCrossed size={32} />
                            </article>
                            <article className="kpi-card kpi-amber">
                                <div>
                                    <p className="kpi-label">Pending complaints</p>
                                    <p className="kpi-card__value">{pendingComplaints}</p>
                                </div>
                                <AlertCircle size={32} />
                            </article>
                            <article className="kpi-card kpi-blue">
                                <div>
                                    <p className="kpi-label">Resolved issues</p>
                                    <p className="kpi-card__value">{resolvedComplaints}</p>
                                </div>
                                <CheckCheck size={32} />
                            </article>
                        </div>

                        <div className="panel-split">
                            <section className="panel">
                                <div className="panel-heading">
                                    <div className="flex" style={{ gap: "12px", alignItems: "center" }}>
                                        <UtensilsCrossed /> <strong>Today's menu</strong>
                                    </div>
                                    <select value={day} onChange={(e) => setDay(e.target.value)} className="form__control">
                                        {DAYS.map((d) => (
                                            <option key={d} value={d}>
                                                {d.toUpperCase()}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="panel-list">
                                    {["breakfast", "lunch", "dinner"].map((meal) => {
                                        const its = week?.[day]?.[meal]?.items ?? []
                                        const label = meal.charAt(0).toUpperCase() + meal.slice(1)
                                        return (
                                            <div key={meal} className="list-card">
                                                <div className="list-card__header">
                                                    <span className="list-card__title">{label}</span>
                                                </div>
                                                <p className="list-card__meta">
                                                    {its.length
                                                        ? its
                                                              .map((x) => (typeof x === "string" ? x : x.name))
                                                              .join(", ")
                                                        : "Not set"}
                                                </p>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="panel-heading" style={{ marginTop: "18px" }}>
                                    <strong>Capacity</strong>
                                    <select value={slot} onChange={(e) => setSlot(e.target.value)} className="form__control">
                                        <option value="breakfast">Breakfast</option>
                                        <option value="lunch">Lunch</option>
                                        <option value="dinner">Dinner</option>
                                    </select>
                                </div>
                                <div style={{ marginTop: "12px" }}>
                                    <div className="badge-info">
                                        {cap.remaining} left / {cap.total}
                                    </div>
                                    <div style={{ marginTop: "8px", height: "14px", borderRadius: "999px", background: "#e2e8f0" }}>
                                        <div
                                            style={{
                                                height: "100%",
                                                borderRadius: "999px",
                                                background: "linear-gradient(90deg,#0ea5e9,#22d3ee)",
                                                width: cap.total > 0 ? `${Math.min(100, ((cap.total - cap.remaining) / cap.total) * 100)}%` : "0%"
                                            }}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="panel">
                                <div className="panel-heading">
                                    <div className="flex" style={{ gap: "12px", alignItems: "center" }}>
                                        <AlertCircle /> <strong>Recent complaints</strong>
                                    </div>
                                </div>
                                <div className="empty-state">No complaints yet.</div>
                            </section>
                        </div>

                        <div className="panel-split">
                            <section className="panel">
                                <h3>Enrolled mess</h3>
                                {enrolledMess ? (
                                    <div className="stack">
                                        <p className="section-title">{enrolledMess.name || "—"}</p>
                                        {enrolledMess.adress && <p className="section-subtitle">{enrolledMess.adress}</p>}
                                        {enrolledMess.price && <div className="badge-info">₹{enrolledMess.price}</div>}
                                    </div>
                                ) : (
                                    <div className="empty-state">Not enrolled</div>
                                )}
                            </section>
                            <section className="panel">
                                <h3>Enrolled hostel</h3>
                                {enrolledHostel ? (
                                    <div className="stack">
                                        <p className="section-title">{enrolledHostel.name || "—"}</p>
                                        {enrolledHostel.adress && <p className="section-subtitle">{enrolledHostel.adress}</p>}
                                        {Array.isArray(enrolledHostel.accepted) && (
                                            <div className="badge-info">Members: {enrolledHostel.accepted.length}</div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="empty-state">Not enrolled</div>
                                )}
                            </section>
                        </div>
                    </div>
                ) : (
                    <div className="content-card">
                        <Outlet />
                    </div>
                )}
            </main>
        </div>
    )
}
