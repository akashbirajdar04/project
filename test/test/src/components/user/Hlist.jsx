import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";
import { Building2, Users } from "lucide-react";

export const Hlist = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolledHostelId, setEnrolledHostelId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/Profile/Hostelrequest");
        setHostels(res.data?.data || []);
        const userId = localStorage.getItem("Id");
        if (userId) {
          try {
            const h = await api.get(`/Profile/student/${userId}/hostel`);
            const arr = h.data?.data || [];
            const hItem = Array.isArray(arr) ? arr[0] : null;
            setEnrolledHostelId(hItem?._id || null);
          } catch (_) {}
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="pt-4 md:pt-8 pr-4 md:pr-8 pb-4 md:pb-8 pl-0">
      <div className="mb-5">
        <div className="text-slate-500 text-sm">View hostel details and availability</div>
        <h1 className="text-2xl font-bold text-slate-800">Hostels</h1>
      </div>

      {loading ? (
        <div className="text-slate-500">Loading...</div>
      ) : hostels.length ? (
        <div className="space-y-4">
          {hostels.map((h) => {
            const isOtherWhileEnrolled = enrolledHostelId && enrolledHostelId !== h._id;
            const CardInner = (
              <div className={`rounded-2xl border border-slate-200 bg-white p-5 ${isOtherWhileEnrolled ? 'opacity-60 cursor-not-allowed' : 'shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-indigo-200 hover:ring-1 hover:ring-indigo-100 transition'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                      <Building2 size={18} />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-slate-800">{h.name || 'Unnamed Hostel'}</div>
                      <div className="text-sm text-slate-500">{h.address || 'Address not provided'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Users size={16} />
                    <span>{Array.isArray(h.accepted) ? h.accepted.length : 0} members</span>
                    {isOtherWhileEnrolled && (
                      <span className="text-xs font-medium bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">Already allocated</span>
                    )}
                  </div>
                </div>
              </div>
            );
            return isOtherWhileEnrolled ? (
              <div key={h._id}>{CardInner}</div>
            ) : (
              <Link key={h._id} to={`/Profile/Hlist/${h._id}`} className="block">{CardInner}</Link>
            );
          })}
        </div>
      ) : (
        <div className="text-slate-500">No hostels found.</div>
      )}
    </div>
  );
};
