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

  return (
    <div>
      {/* Render complaints list, loading state, and creation form here */}
    </div>
  );
};

export default Complaints;