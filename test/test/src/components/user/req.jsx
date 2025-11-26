import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { Send, ArrowLeft, Building2, User, CheckCircle, XCircle, Clock, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export const Req = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const senderid = localStorage.getItem("Id");

  const [status, setStatus] = useState(null); // "pending" | "accepted" | "rejected" | null
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!senderid) {
      toast.error("You must be logged in to send a request.");
      return;
    }

    try {
      setLoading(true);
      // Note: The original code used a very specific URL structure. 
      // Assuming the backend expects POST /Profile/Hostelrequest/:hostelId/:senderId
      await api.post(`/Profile/Hostelrequest/${id}/${senderid}`, {});
      setStatus("pending");
      toast.success("Request sent successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Cannot send the request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-500 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-blue-600" />
            Hostel Request
          </h2>
          <span className="text-xs font-mono text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
            ID: {id}
          </span>
        </div>

        <div className="p-8">
          <div className="flex items-center justify-between mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Applicant</p>
                <p className="font-medium text-slate-900">{senderid ? "Current User" : "Not logged in"}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Status</p>
              <div className="mt-1">
                {status === null && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    Not sent
                  </span>
                )}
                {status === "pending" && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                    <Clock className="w-3 h-3 mr-1" /> Pending
                  </span>
                )}
                {status === "accepted" && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" /> Accepted
                  </span>
                )}
                {status === "rejected" && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                    <XCircle className="w-3 h-3 mr-1" /> Rejected
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-center space-y-6">
            <p className="text-slate-600 leading-relaxed">
              Click the button below to send a formal request to join this hostel.
              The hostel owner will review your application and you will be notified of their decision.
            </p>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleClick}
                disabled={loading || !senderid || status === "pending" || status === "accepted"}
                className={`inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold shadow-sm transition-all transform active:scale-95
                  ${loading || !senderid || status === "pending" || status === "accepted"
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                    : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"}
                `}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Request
                  </>
                )}
              </button>

              {status && (
                <button
                  onClick={() => setStatus(null)}
                  className="inline-flex items-center justify-center px-4 py-3 rounded-xl font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Req;
