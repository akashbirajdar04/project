import React, { useState, useEffect } from "react";
import api from "../api";
import { toast } from "react-toastify";

const Complaints = ({ userId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ description: "" });

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
      toast.success("Status updated");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div>
      <h2>My Complaints</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <p>{item.description}</p>
              <p>Status: {item.status}</p>
              <button onClick={() => updateStatus(item.id, "resolved")}>
                Mark as Resolved
              </button>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={onCreate}>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Describe your complaint"
          required
        />
        <button type="submit">Create Complaint</button>
      </form>
    </div>
  );
};

export default Complaints;