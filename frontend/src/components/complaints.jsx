import { useEffect, useState } from "react";
import api from "../lib/api";
import { toast } from "sonner";
import { AlertCircle, CheckCircle, Clock, MessageSquare, Send, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

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
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Complaints & Support</h1>
        <p className="text-xs text-slate-500 mt-1">Submit tickets for facility maintenance, housekeeping, or room issues</p>
      </div>

      <Card>
        <CardHeader className="py-3 bg-slate-50/60 border-b border-slate-100">
          <CardTitle className="text-sm font-semibold text-slate-800">Create Support Ticket</CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-3">
              <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 text-slate-800"
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
              <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
              <Input
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Describe the issue in detail..."
                required
              />
            </div>
            <div className="md:col-span-2 flex items-end">
              <Button type="submit" variant="primary" className="w-full">
                <Send className="w-3.5 h-3.5 mr-1.5" />
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-900">Your Tickets</h3>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-slate-200/80">
            <Loader2 className="h-6 w-6 text-indigo-600 animate-spin mb-2" />
            <p className="text-xs text-slate-500">Loading tickets...</p>
          </div>
        ) : items.length === 0 ? (
          <Card className="text-center py-12">
            <AlertCircle className="mx-auto h-8 w-8 text-slate-300 mb-2" />
            <p className="text-xs text-slate-500">No support tickets created yet.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {items.map((t) => (
              <Card key={t._id} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${
                      t.status === 'resolved'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : t.status === 'closed'
                        ? 'bg-slate-100 text-slate-600 border-slate-200'
                        : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                    }`}>
                      {t.status === 'resolved' ? <CheckCircle size={18} /> : <Clock size={18} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 capitalize">{t.category} Issue</h4>
                      <p className="text-[11px] text-slate-400">{new Date(t.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <Badge variant={t.status === 'resolved' ? 'success' : t.status === 'closed' ? 'secondary' : 'info'} className="capitalize">
                    {t.status?.replace("_", " ")}
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 mb-4 pl-11 leading-relaxed">{t.description}</p>

                <div className="pl-11 pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Status:</span>
                    <select
                      defaultValue={t.status}
                      onChange={(e) => updateStatus(t._id, e.target.value)}
                      className="px-2 py-1 rounded-md border border-slate-200 text-xs bg-slate-50 text-slate-700"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <FeedbackSection ticket={t} onSubmit={submitFeedback} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FeedbackSection = ({ ticket, onSubmit }) => {
  const [rating, setRating] = useState(ticket.feedback?.rating ?? 5);
  const [comment, setComment] = useState(ticket.feedback?.comment ?? "");
  const canSend = rating >= 1 && rating <= 5 && comment.trim().length > 0;
  const isLocked = ticket.status !== 'resolved' && ticket.status !== 'closed';

  return (
    <div className="bg-slate-50/80 rounded-lg p-3 border border-slate-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
          <MessageSquare size={14} className="text-slate-400" />
          Feedback
        </div>
        {ticket.feedback && (
          <Badge variant="success" className="text-[10px] py-0">Submitted</Badge>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          disabled={isLocked}
          className="md:col-span-3 px-2 py-1 rounded-md border border-slate-200 text-xs bg-white text-slate-700"
        >
          {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Stars ⭐</option>)}
        </select>
        <Input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isLocked}
          placeholder={isLocked ? "Feedback available after resolution" : "Write your feedback..."}
          className="md:col-span-7 h-8 text-xs"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSubmit(ticket._id, rating, comment)}
          disabled={!canSend || isLocked}
          className="md:col-span-2 h-8 text-xs"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Complaints;
