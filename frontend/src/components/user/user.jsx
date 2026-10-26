import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api";
import {
  UtensilsCrossed,
  CalendarDays,
  AlertCircle,
  CheckCheck,
  Building2,
  MessageSquare,
  Megaphone,
} from "lucide-react";

export const User = () => {
  const userId = localStorage.getItem("Id");
  const location = useLocation();
  const atHome = location.pathname === "/Profile" || location.pathname === "/Profile/";

  // Summary states
  const [enrolledMess, setEnrolledMess] = useState(null);
  const [enrolledHostel, setEnrolledHostel] = useState(null);
  const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  // eslint-disable-next-line no-unused-vars
  const [day, setDay] = useState(DAYS[todayIdx]);
  // eslint-disable-next-line no-unused-vars
  const [slot, setSlot] = useState("lunch");
  const [week, setWeek] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [cap, setCap] = useState({ remaining: 0, total: 0 });
  // eslint-disable-next-line no-unused-vars
  const [bookings, setBookings] = useState([]);
  const [pendingComplaints, setPendingComplaints] = useState(0);
  const [resolvedComplaints, setResolvedComplaints] = useState(0);

  // eslint-disable-next-line no-unused-vars
  const items = useMemo(() => week?.[day]?.[slot]?.items ?? [], [week, day, slot]);

  useEffect(() => {
    const load = async () => {
      try {
        if (userId) {
          // Enrolled mess
          const m = await api.get(`/student/${userId}/mess`);
          setEn