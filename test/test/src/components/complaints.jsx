import { useEffect, useState } from "react";
import api from "../lib/api";
import { toast } from "sonner";
import { AlertCircle, CheckCircle, Clock, MessageSquare, Send, Loader2 } from "lucide-react";

export const Complaints = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ category: "room", description: "", images: [] });
  const userId = localStorage.getItem("Id");

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/complaints", { ...form, userId });
      setForm({ ...form, description: "" });
      toast.success("Ticket created");
      await fetchData();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to create");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/complaints/${id}/status`, { status });
      toast.success("Status updated");
      await fetchData();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to update status");
    }
  };

  const submitFeedback = async (id, rating, comment) => {
    try {
      await api.post(`/complaints/${id}/feedback`, { rating, comment });
      toast.success("Feedback submitted");
      await fetchData();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to submit feedback");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Complaints & Support</h1>
        <p className="text-slate-500 text-sm mt-1">Raise tickets for any issues you face</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Create New Ticket</h3>
        <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 border px-3"
            >
              <option value="room">Room</option>
              <option value="plumbing">Plumbing</option>
              <option value="electricity">Electricity</option>
              <option value="housekeeping">Housekeeping</option>
              <option value="food">Food</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="md:col-span-7">
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <input
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Describe the issue in detail..."
              className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 border px-3"
              required
            />
          </div>
          <div className="md:col-span-2 flex items-end">
            <button
              type="submit"
              className="w-full flex justify-center items-center px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors shadow-sm"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">Your Tickets</h3>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
            <AlertCircle className="mx-auto h-10 w-10 text-slate-300 mb-3" />
            <p className="text-slate-500">No tickets found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {items.map((t) => (
              <div key={t._id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${t.status === 'resolved' ? 'bg-green-100 text-green-600' :
                      t.status === 'closed' ? 'bg-slate-100 text-slate-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                      {t.status === 'resolved' ? <CheckCircle size={20} /> : <Clock size={20} />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 capitalize">{t.category} Issue</h4>
                      <p className="text-xs text-slate-500">{new Date(t.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${t.status === 'resolved' ? 'bg-green-50 text-green-700 border-green-200' :
                    t.status === 'closed' ? 'bg-slate-50 text-slate-700 border-slate-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                    {t.status?.replace("_", " ")}
                  </span>
                </div>

                <p className="text-slate-700 mb-4 ml-12">{t.description}</p>

                <div className="ml-12 pt-4 border-t border-slate-100">
                  {/* Status control - simplified for demo, usually admin only */}
                  <div className="flex items-center gap-3 mb-4">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Update Status:</label>
                    <select
                      defaultValue={t.status}
                      onChange={(e) => updateStatus(t._id, e.target.value)}
                      className="px-2 py-1 rounded border border-slate-300 text-xs bg-slate-50 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  {/* Feedback */}
                  <FeedbackSection ticket={t} onSubmit={submitFeedback} />
                </div>
              </div>
            ))}
          </div>
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
    <div className="bg-slate-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
          <MessageSquare size={16} className="text-slate-500" />
          Feedback
        </div>
        {ticket.feedback && (
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200">Saved</span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          disabled={isLocked}
          className="md:col-span-2 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} ⭐</option>)}
        </select>
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isLocked}
          placeholder={isLocked ? "Feedback enabled after resolution" : "Write your feedback..."}
          className="md:col-span-8 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={() => onSubmit(ticket._id, rating, comment)}
          disabled={!canSend || isLocked}
          className="md:col-span-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Submit
        </button>
      </div>
    </div>
  )
}
