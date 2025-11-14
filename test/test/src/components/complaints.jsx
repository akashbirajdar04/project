import { useEffect, useState } from "react";
import api from "../lib/api";
import { toast } from "sonner";

export const Complaints = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ category: "room", description: "", images: [] });
  const userId = localStorage.getItem("Id");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tickets/my", { params: { userId } });
      setItems(res.data?.data ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tickets", { ...form, userId });
      setForm({ ...form, description: "" });
      toast.success("Ticket created");
      await fetchData();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to create");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/tickets/${id}/status`, { status });
      toast.success("Status updated");
      await fetchData();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to update status");
    }
  };

  const submitFeedback = async (id, rating, comment) => {
    try {
      await api.post(`/tickets/${id}/feedback`, { rating, comment });
      toast.success("Feedback submitted");
      await fetchData();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to submit feedback");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl md:text-2xl font-semibold text-slate-800">Complaints</h1>

      <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white border border-slate-200 rounded-xl p-4">
        <select
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          className="md:col-span-3 px-3 py-2 rounded-lg border border-slate-300"
        >
          <option value="room">Room</option>
          <option value="plumbing">Plumbing</option>
          <option value="electricity">Electricity</option>
          <option value="housekeeping">Housekeeping</option>
          <option value="food">Food</option>
          <option value="other">Other</option>
        </select>
        <input
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Describe the issue"
          className="md:col-span-7 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500"
          required
        />
        <button type="submit" className="md:col-span-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Submit</button>
      </form>

      <div className="grid gap-3">
        {loading ? (
          <div className="text-slate-500">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-slate-500">No tickets</div>
        ) : (
          items.map((t) => (
            <div key={t._id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 capitalize">{t.category}</span>
                <span className="text-xs rounded px-2 py-0.5 border bg-slate-50 border-slate-200 text-slate-700">
                  {t.status?.replace("_", " ")}
                </span>
              </div>
              <p className="text-slate-700 mt-1">{t.description}</p>
              <div className="text-xs text-slate-500 mt-2">{new Date(t.createdAt).toLocaleString()}</div>

              {/* Status control */}
              <div className="mt-3 flex items-center gap-2">
                <label className="text-xs text-slate-600">Update status:</label>
                <select
                  defaultValue={t.status}
                  onChange={(e)=>updateStatus(t._id, e.target.value)}
                  className="px-2 py-1 rounded border border-slate-300 text-sm"
                >
                  <option value="open">open</option>
                  <option value="in_progress">in_progress</option>
                  <option value="resolved">resolved</option>
                  <option value="closed">closed</option>
                </select>
              </div>

              {/* Feedback */}
              <FeedbackSection ticket={t} onSubmit={submitFeedback} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const FeedbackSection = ({ ticket, onSubmit }) => {
  const [rating, setRating] = useState(ticket.feedback?.rating ?? 5);
  const [comment, setComment] = useState(ticket.feedback?.comment ?? "");
  const canSend = rating >= 1 && rating <= 5 && comment.trim().length > 0;
  const isLocked = ticket.status !== 'resolved' && ticket.status !== 'closed';

  return (
    <div className="mt-3 border-t border-slate-100 pt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-800">Feedback</span>
        {ticket.feedback && (
          <span className="text-xs text-slate-500">Saved</span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
        <select value={rating} onChange={(e)=>setRating(Number(e.target.value))} disabled={isLocked} className="md:col-span-2 px-2 py-2 rounded-lg border border-slate-300">
          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ⭐</option>)}
        </select>
        <input
          value={comment}
          onChange={(e)=>setComment(e.target.value)}
          disabled={isLocked}
          placeholder={isLocked ? "Feedback enabled after resolved/closed" : "Write your feedback"}
          className="md:col-span-8 px-3 py-2 rounded-lg border border-slate-300"
        />
        <button
          onClick={()=>onSubmit(ticket._id, rating, comment)}
          disabled={!canSend || isLocked}
          className="md:col-span-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          Submit
        </button>
      </div>
    </div>
  )
}
