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
    <div className="content-card">
      <header className="panel-heading" style={{ marginBottom: "24px" }}>
        <div>
          <p className="section-subtitle">Browse verified accomodations</p>
          <h2 className="section-title">Hostels</h2>
        </div>
      </header>

      {loading ? (
        <div className="empty-state">Loading hostels...</div>
      ) : hostels.length ? (
        <div className="list-grid card-grid">
          {hostels.map((h) => {
            const isOtherWhileEnrolled = enrolledHostelId && enrolledHostelId !== h._id;
            const CardInner = (
              <article className={`list-card${isOtherWhileEnrolled ? " opacity-60" : ""}`}>
                <div className="list-card__header">
                  <div>
                    <div className="list-card__title">{h.name || "Unnamed hostel"}</div>
                    <div className="list-card__meta">{h.address || "Address not provided"}</div>
                  </div>
                  <div className="badge-info">{Array.isArray(h.accepted) ? h.accepted.length : 0} members</div>
                </div>
                {isOtherWhileEnrolled && <div className="badge-warning">Already allocated</div>}
              </article>
            );
            return isOtherWhileEnrolled ? (
              <div key={h._id}>{CardInner}</div>
            ) : (
              <Link key={h._id} to={`/Profile/Hlist/${h._id}`} className="block">
                {CardInner}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">No hostels found. Check back later.</div>
      )}
    </div>
  );
};
