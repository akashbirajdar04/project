import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";
import { UtensilsCrossed, MapPin, IndianRupee } from "lucide-react";

export const Mlist = () => {
  const [getlist, setGetlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolledMessId, setEnrolledMessId] = useState(null);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await api.get("/Profile/messList");
        setGetlist(res.data?.data || []);
        const userId = localStorage.getItem("Id");
        if (userId) {
          try {
            const m = await api.get(`/student/${userId}/mess`);
            setEnrolledMessId(m.data?.data?._id || null);
          } catch (_) { }
        }
      } catch (error) {
        console.error("Error fetching mess list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Mess Facilities</h1>
        <p className="text-slate-500 mt-1">Choose your preferred dining facility</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : getlist.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {getlist.map((res) => {
            const isOtherWhileEnrolled = enrolledMessId && enrolledMessId !== res._id;
            const isEnrolled = enrolledMessId === res._id;

            const CardContent = (
              <div className={`h-full flex flex-col bg-white rounded-xl border border-slate-200 p-5 transition-all duration-200 ${!isOtherWhileEnrolled ? 'hover:shadow-lg hover:border-blue-200 hover:-translate-y-1' : 'opacity-60'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-orange-50 text-orange-600 overflow-hidden relative w-12 h-12 flex items-center justify-center">
                    {res.avatar?.url ? (
                      <img
                        src={res.avatar.url}
                        alt={res.name}
                        className="w-full h-full object-cover rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <UtensilsCrossed size={24} />
                    )}
                  </div>
                  {isEnrolled && (
                    <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full">
                      Enrolled
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-1">{res.name || 'Unnamed Mess'}</h3>

                <div className="flex items-start gap-2 text-sm text-slate-500 mb-4 flex-1">
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  <span className="line-clamp-2">{res.address || 'Address not provided'}</span>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 font-medium text-slate-700">
                    {res.price ? (
                      <>
                        <IndianRupee size={14} />
                        <span>{res.price}/month</span>
                      </>
                    ) : (
                      <span className="text-slate-400">Price not set</span>
                    )}
                  </div>
                  {!isOtherWhileEnrolled && (
                    <span className="text-blue-600 font-medium group-hover:underline">View Details →</span>
                  )}
                </div>
              </div>
            );

            return isOtherWhileEnrolled ? (
              <div key={res._id} className="cursor-not-allowed">{CardContent}</div>
            ) : (
              <Link
                key={res._id}
                to={`/Profile/Mlist/${res._id}`}
                className="block group"
              >
                {CardContent}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
          <UtensilsCrossed size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No mess facilities found</h3>
          <p className="text-slate-500">Check back later for new listings.</p>
        </div>
      )}
    </div>
  );
};
