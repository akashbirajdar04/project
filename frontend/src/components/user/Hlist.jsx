import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";
import { Building2, Users, MapPin } from "lucide-react";

export const Hlist = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolledHostelId, setEnrolledHostelId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/Profile/Hostelrequest");
        console.log("Hostel List Data:", res.data?.data);
        setHostels(res.data?.data || []);
        const userId = localStorage.getItem("Id");
        if (userId) {
          try {
            const h = await api.get(`/Profile/student/${userId}/hostel`);
            const arr = h.data?.data || [];
            const hItem = Array.isArray(arr) ? arr[0] : null;
            setEnrolledHostelId(hItem?._id || null);
          } catch (e) { console.error(e); }
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
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Hostels</h1>
        <p className="text-slate-500 mt-1">Browse and enroll in available hostels</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : hostels.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {hostels.map((h) => {
            const isOtherWhileEnrolled = enrolledHostelId && enrolledHostelId !== h._id;
            const isEnrolled = enrolledHostelId === h._id;

            const CardContent = (
              <div className={`h-full flex flex-col bg-white rounded-xl border border-slate-200 p-5 transition-all duration-200 ${!isOtherWhileEnrolled ? 'hover:shadow-lg hover:border-blue-200 hover:-translate-y-1' : 'opacity-60'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-blue-50 text-blue-600 overflow-hidden relative w-12 h-12 flex items-center justify-center">
                    {h.avatar?.url ? (
                      <img
                        src={h.avatar.url}
                        alt={h.name}
                        className="w-full h-full object-cover rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Building2 size={24} />
                    )}
                  </div>
                  {isEnrolled && (
                    <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full">
                      Enrolled
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-1">{h.name || 'Unnamed Hostel'}</h3>

                <div className="flex items-start gap-2 text-sm text-slate-500 mb-4 flex-1">
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  <span className="line-clamp-2">{h.address || 'Address not provided'}</span>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Users size={16} />
                    <span>{Array.isArray(h.accepted) ? h.accepted.length : 0} Members</span>
                  </div>
                  {!isOtherWhileEnrolled && (
                    <span className="text-blue-600 font-medium group-hover:underline">View Details →</span>
                  )}
                </div>
              </div>
            );

            return isOtherWhileEnrolled ? (
              <div key={h._id} className="cursor-not-allowed">{CardContent}</div>
            ) : (
              <Link key={h._id} to={`/Profile/Hlist/${h._id}`} className="block group">
                {CardContent}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
          <Building2 size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No hostels found</h3>
          <p className="text-slate-500">Check back later for new listings.</p>
        </div>
      )}
    </div>
  );
};
