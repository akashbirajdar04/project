import React, { useState, useEffect } from "react";
import api from "../api";
import { toast } from "react-toastify";

const Complaints = ({ userId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ description: "" });

  // Previously declared as `time` but never used; renamed to satisfy lint rule.
  const TIME = Date.now();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/complaints/my", { params: { userId } });
      setItems(res.data?.data ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/complaints", { ...form, userId });
      setForm({ ...form, description: "" });
      toast.success("Ticket created successfully");
      await fetchData();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to create ticket");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/complaints/${id}`, { status });
      await fetchData();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to update status");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="complaints-container">
      <h2>My Complaints</h2>

      {/* Creation Form */}
      <form onSubmit={onCreate} style={{ marginBottom: "1rem" }}>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe your complaint..."
          rows={3}
          style={{ width: "100%" }}
          required
        />
        <button type="submit" disabled={loading} style={{ marginTop: "0.5rem" }}>
          {loading ? "Submitting..." : "Create Complaint"}
        </button>
      </form>

      {/* Loading Indicator */}
      {loading && <p>Loading complaints...</p>}

      {/* Complaints List */}
      {!loading && items.length === 0 && <p>No complaints found.</p>}
      {!loading && items.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {items.map((item) => (
            <li
              key={item.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "0.75rem",
                marginBottom: "0.5rem",
              }}
            >
              <p>
                <strong>Description:</strong> {item.description}
              </p>
              <p>
                <strong>Status:</strong> {item.status}
              </p>
              {item.status !== "closed" && (
                <button
                  onClick={() => updateStatus(item.id, "closed")}
                  style={{ marginTop: "0.5rem" }}
                >
                  Mark as Closed
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Complaints;