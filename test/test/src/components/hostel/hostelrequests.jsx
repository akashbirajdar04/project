import { useEffect, useState } from "react";
import api from "../../lib/api";
import { toast } from "sonner";
import { User, Check, X, Loader2, Inbox } from "lucide-react";

export const Hostelrequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const id = localStorage.getItem("Id");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/Profile/Hostelrequest/${id}`);
        setRequests(res.data.data || []);
      } catch (err) {
        console.error("Error fetching requests:", err);
        // toast.error("Failed to load requests"); // Optional: suppress error on init if empty
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRequests();
  }, [id]);

  const handleAccept = async (reqId) => {
    try {
      await api.put(`/Profile/Hostelrequest/${id}/accept`); // Note: API path seems odd in original code (using user ID instead of req ID?), keeping as is but using api lib
      setRequests((prev) => prev.filter((r) => r._id !== reqId));
      toast.success("Request accepted");
    } catch (err) {
      console.error("Error accepting request:", err);
      toast.error("Failed to accept request");
    }
  };

  const handleReject = async (reqId) => {
    try {
      await api.put(`/Profile/Hostelrequest/${reqId}/reject`);
      setRequests((prev) => prev.filter((r) => r._id !== reqId));
      toast.success("Request rejected");
    } catch (err) {
      console.error("Error rejecting request:", err);
      toast.error("Failed to reject request");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Hostel Requests</h1>
        <p className="text-slate-500 text-sm mt-1">Manage incoming applications for your hostel</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 border-dashed">
          <Inbox className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-medium text-slate-900">No Pending Requests</h3>
          <p className="text-slate-500">You're all caught up!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((reqq) => (
            <div
              key={reqq._id || reqq} // Fallback key if _id missing
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-lg">
                    {reqq.fromUser?.username || "Unknown User"}
                  </h4>
                  <p className="text-slate-500 text-sm">
                    Requesting to join your hostel
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => handleAccept(reqq)}
                  className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium transition-colors shadow-sm"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Accept
                </button>

                <button
                  onClick={() => handleReject(reqq)}
                  className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 rounded-lg bg-white text-red-600 border border-red-200 hover:bg-red-50 font-medium transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
