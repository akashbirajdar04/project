import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";
import { UtensilsCrossed } from "lucide-react";

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
          } catch (_) {}
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
    <div className="pt-4 md:pt-8 pr-4 md:pr-8 pb-4 md:pb-8 pl-0">
      <div className="mb-5">
        <div className="text-slate-500 text-sm">Choose your preferred mess</div>
        <h1 className="text-2xl font-bold text-slate-800">Mess</h1>
      </div>

      {loading ? (
        <div className="text-slate-500">Loading...</div>
      ) : getlist.length > 0 ? (
        <div className="space-y-4">
          {getlist.map((res) => {
            const isOtherWhileEnrolled = enrolledMessId && enrolledMessId !== res._id;
            const CardInner = (
              <div className={`rounded-2xl border border-slate-200 bg-white p-5 ${isOtherWhileEnrolled ? 'opacity-60 cursor-not-allowed' : 'shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-emerald-200 hover:ring-1 hover:ring-emerald-100 transition'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                      <UtensilsCrossed size={18} />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-slate-800">{res.name || 'Unnamed Mess'}</div>
                      <div className="text-sm text-slate-500">{res.address || 'Address not provided'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {res.price && (
                      <span className="text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        ₹{res.price}
                      </span>
                    )}
                    {isOtherWhileEnrolled && (
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">Already enrolled</span>
                    )}
                  </div>
                </div>
              </div>
            );

            return isOtherWhileEnrolled ? (
              <div key={res._id}>{CardInner}</div>
            ) : (
              <Link
                key={res._id}
                to={`/Profile/Hlist/${res._id}`}
                className="block rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-emerald-200 hover:ring-1 hover:ring-emerald-100 transition p-5"
              >
                {CardInner}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-slate-500">No mess found.</div>
      )}
    </div>
  );
};

