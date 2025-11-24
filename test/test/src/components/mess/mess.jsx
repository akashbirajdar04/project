import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import api from "../../lib/api";

export const Mess = () => {
  const DAYS = ["mon","tue","wed","thu","fri","sat","sun"]
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay()-1
  const [day, setDay] = useState(DAYS[todayIdx])
  const [slot, setSlot] = useState("lunch")
  const [week, setWeek] = useState({})
  const [cap, setCap] = useState({ remaining: 0, total: 0 })

  const items = useMemo(() => week?.[day]?.[slot]?.items ?? [], [week, day, slot])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/mess/menu/week")
        setWeek(res.data?.data ?? {})
      } catch (_) {}
    }
    load()
  }, [])

  useEffect(() => {
    const loadCap = async () => {
      try {
        const res = await api.get("/mess/capacity", { params: { day, slot } })
        setCap(res.data?.data ?? { remaining: 0, total: 0 })
      } catch (_) {}
    }
    loadCap()
  }, [day, slot])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col items-stretch py-8 md:py-10 font-sans">
      {/* Header */}
      <div className="w-full px-4 md:px-8">
        <div className="bg-white/70 backdrop-blur rounded-2xl border border-emerald-100 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 text-xl">🍽️</span>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-emerald-700 leading-tight">Mess Management Dashboard</h1>
              <p className="text-slate-600 text-sm md:text-base">Manage profile, review requests, and track your request list.</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-6 flex flex-wrap gap-2">
          <NavLink
            to="Messprofile"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm border ${
                isActive
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50"
              }`
            }
          >
            Mess Profile
          </NavLink>

          <NavLink
            to="Messaccepted"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm border ${
                isActive
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50"
              }`
            }
          >
            Accepted Members
          </NavLink>

          <NavLink
            to="Messrequests"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm border ${
                isActive
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-teal-700 border-teal-200 hover:bg-teal-50"
              }`
            }
          >
            Mess Requests
          </NavLink>

          <NavLink
            to="mess-menu"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm border ${
                isActive
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50"
              }`
            }
          >
            Manage Menu
          </NavLink>

          <NavLink
            to="Requestlist"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm border ${
                isActive
                  ? "bg-cyan-600 text-white border-cyan-600"
                  : "bg-white text-cyan-700 border-cyan-200 hover:bg-cyan-50"
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
          <div className="col-span-12 xl:col-span-3 bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900">Today’s Menu</h3>
              <select value={day} onChange={(e)=>setDay(e.target.value)} className="px-2 py-1 rounded border border-slate-300 text-sm">
                {DAYS.map(d => <option key={d} value={d}>{d.toUpperCase()}</option>)}
              </select>
              <select value={slot} onChange={(e)=>setSlot(e.target.value)} className="px-2 py-1 rounded border border-slate-300 text-sm">
                <option value="breakfast">breakfast</option>
                <option value="lunch">lunch</option>
                <option value="dinner">dinner</option>
              </select>
            </div>
            <div className="text-sm text-slate-600">Capacity: {cap.remaining} left / {cap.total}</div>
          </div>
          <div className="mt-3">
            {items.length === 0 ? (
              <div className="text-slate-500 text-sm">No items set</div>
            ) : (
              <ul className="text-slate-800 text-sm list-disc pl-5">
                {items.slice(0,3).map((it, idx) => (
                  <li key={idx}>{typeof it === 'string' ? it : it.name}</li>
                ))}
                {items.length > 3 && <li className="text-slate-500">+{items.length-3} more</li>}
              </ul>
            )}
          </div>
          {/* Progress */}
          <div className="mt-3 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500"
              style={{ width: cap.total > 0 ? `${Math.min(100, (100*(cap.total-cap.remaining))/cap.total)}%` : '0%' }}
            />
          </div>
          </div>

          <div className="col-span-12 xl:col-span-9 bg-white p-6 md:p-8 rounded-2xl shadow-md border border-slate-200 min-h-[60vh]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
