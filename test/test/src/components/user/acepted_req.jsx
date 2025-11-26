import { useEffect, useState } from "react";
import api from "../../lib/api";
import { toast } from "sonner";
import { CheckCircle, CreditCard, UtensilsCrossed, Loader2 } from "lucide-react";

export const Acceptedreq = () => {
  const id = localStorage.getItem("Id");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/Profile/Accepted-list/${id}`);
        // The API seems to return an object where values are the items
        const data = res.data?.data;
        const arr = typeof data === 'object' && !Array.isArray(data) ? Object.values(data) : (Array.isArray(data) ? data : []);
        setRequests(arr);
      } catch (err) {
        console.error(err);
        // toast.error("Failed to fetch accepted requests");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [id]);

  const handlePay = (reqId) => {
    toast.info("Payment gateway integration coming soon!");
    console.log("Pay clicked for", reqId);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Accepted Requests</h1>
        <p className="text-slate-500 text-sm mt-1">Complete payment to finalize your enrollment</p>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 border-dashed">
          <CheckCircle className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-medium text-slate-900">No Accepted Requests</h3>
          <p className="text-slate-500">Your accepted applications will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((r) => (
            <div key={r._id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
                    <UtensilsCrossed size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{r.messName || "Unnamed Mess"}</h3>
                    <p className="text-slate-500 text-sm">Your request has been accepted!</p>
                    <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Ready for Payment
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handlePay(r._id)}
                  className="flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-sm transition-transform active:scale-95"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};