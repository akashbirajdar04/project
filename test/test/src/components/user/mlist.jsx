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
    <div className="content-card">
      <header className="panel-heading" style={{ marginBottom: "24px" }}>
        <div>
          <p className="section-subtitle">Curated dining partners</p>
          <h2 className="section-title">Mess facilities</h2>
        </div>
      </header>

      {loading ? (
        <div className="empty-state">Loading mess facilities...</div>
      ) : getlist.length > 0 ? (
        <div className="list-grid card-grid">
          {getlist.map((res) => {
            const isOtherWhileEnrolled = enrolledMessId && enrolledMessId !== res._id;
            const CardInner = (
              <article className={`list-card${isOtherWhileEnrolled ? " opacity-60" : ""}`}>
                <div className="list-card__header">
                  <div>
                    <div className="list-card__title">{res.name || "Unnamed mess"}</div>
                    <div className="list-card__meta">{res.address || "Address not provided"}</div>
                  </div>
                  {res.price && <div className="badge-info">₹{res.price}</div>}
                </div>
                {isOtherWhileEnrolled && <div className="badge-warning">Already enrolled</div>}
              </article>
            );

            return isOtherWhileEnrolled ? (
              <div key={res._id}>{CardInner}</div>
            ) : (
              <Link key={res._id} to={`/Profile/Hlist/${res._id}`} className="block">
                {CardInner}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">No mess facilities found.</div>
      )}
    </div>
  );
};

