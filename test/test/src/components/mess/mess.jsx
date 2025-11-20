import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import api from "../../lib/api";

export const Mess = () => {
  const DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const todayIndex = new Date().getDay();
  const [day, setDay] = useState(DAYS[todayIndex]);
  const [slot, setSlot] = useState("lunch")
  const [week, setWeek] = useState({})
  const [cap, setCap] = useState({ remaining: 0, total: 0 })

  const items = useMemo(() => week?.[day]?.[slot]?.items ?? [], [week, day, slot])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/mess/menu/week")
        setWeek(res.data?.data ?? {})
      } catch (err) {
        console.error("Failed to load week menu:", err);
      }
    }
    load()
  }, [])

  useEffect(() => {
    const loadCap = async () => {
      try {
        const res = await api.get("/mess/capacity", { params: { day, slot } })
        setCap(res.data?.data ?? { remaining: 0, total: 0 })
      } catch (err) {
        console.error("Failed to load capacity:", err);
      }
    }
    loadCap()
  }, [day, slot])

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col items-stretch py-8 md:py-10 font-sans">
      {/* Header */}
      <div className="w-full px-4 md:px-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-emerald-100 p-6 md:p-8 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-md">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent leading-tight">Mess Management Dashboard</h1>
              <p className="text-slate-600 text-sm md:text-base mt-1">Manage profile, review requests, and track your request list.</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-6 flex flex-wrap gap-3">
          <NavLink
            to="Messprofile"
            className={({ isActive }) =>
              `px-5 py-3 rounded-xl text-sm font-semibold transition-all shadow-md border-2 card-hover ${
                isActive
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 shadow-lg"
                  : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300"
              }`
            }
          >
            Mess Profile
          </NavLink>

          <NavLink
            to="Messaccepted"
            className={({ isActive }) =>
              `px-5 py-3 rounded-xl text-sm font-semibold transition-all shadow-md border-2 card-hover ${
                isActive
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 shadow-lg"
                  : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300"
              }`
            }
          >
            Accepted Members
          </NavLink>

          <NavLink
            to="Messrequests"
            className={({ isActive }) =>
              `px-5 py-3 rounded-xl text-sm font-semibold transition-all shadow-md border-2 card-hover ${
                isActive
                  ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white border-teal-600 shadow-lg"
                  : "bg-white text-teal-700 border-teal-200 hover:bg-teal-50 hover:border-teal-300"
              }`
            }
          >
            Mess Requests
          </NavLink>

          <NavLink
            to="mess-menu"
            className={({ isActive }) =>
              `px-5 py-3 rounded-xl text-sm font-semibold transition-all shadow-md border-2 card-hover ${
                isActive
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 shadow-lg"
                  : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300"
              }`
            }
          >
            Manage Menu
          </NavLink>

          <NavLink
            to="Requestlist"
            className={({ isActive }) =>
              `px-5 py-3 rounded-xl text-sm font-semibold transition-all shadow-md border-2 card-hover ${
                isActive
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-600 shadow-lg"
                  : "bg-white text-cyan-700 border-cyan-200 hover:bg-cyan-50 hover:border-cyan-300"
              }`
            }
          >
            Request List
          </NavLink>
        </div>
      </div>

      {/* Render child routes */}
      <div className="w-full px-4 md:px-8 mt-6">
        {/* Today summary + content */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 xl:col-span-3 bg-white/80 backdrop-blur-sm p-5 md:p-6 rounded-2xl shadow-lg border-2 border-emerald-100">
            <div className="mb-4">
              <h3 className="font-bold text-lg text-slate-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Today's Menu
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                <select value={day} onChange={(e)=>setDay(e.target.value)} className="px-3 py-1.5 rounded-lg border-2 border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(d => <option key={d} value={d}>{d.toUpperCase()}</option>)}
                </select>
                <select value={slot} onChange={(e)=>setSlot(e.target.value)} className="px-3 py-1.5 rounded-lg border-2 border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                </select>
              </div>
            </div>
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="text-xs font-semibold text-emerald-700 mb-1">Capacity</div>
              <div className="text-sm font-bold text-emerald-900">{cap.remaining} left / {cap.total}</div>
            </div>
            <div className="mb-4">
              {items.length === 0 ? (
                <div className="text-slate-500 text-sm p-3 rounded-lg bg-slate-50 border border-slate-200">No items set</div>
              ) : (
                <ul className="text-slate-800 text-sm space-y-2">
                  {items.slice(0,3).map((it, idx) => (
                    <li key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      {typeof it === 'string' ? it : it.name}
                    </li>
                  ))}
                  {items.length > 3 && <li className="text-slate-500 text-sm p-2">+{items.length-3} more items</li>}
                </ul>
              )}
            </div>
            {/* Progress */}
            <div className="mt-4">
              <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                  style={{ width: cap.total > 0 ? `${Math.min(100, (100*(cap.total-cap.remaining))/cap.total)}%` : '0%' }}
                />
              </div>
            </div>
          </div>

          <div className="col-span-12 xl:col-span-9 bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg border-2 border-slate-200 min-h-[60vh]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
