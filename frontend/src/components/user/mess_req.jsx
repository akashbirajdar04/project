import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import {
  Send,
  ArrowLeft,
  UtensilsCrossed,
  User,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import PayButton from "../payment";

export const MessReq = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const senderid = localStorage.getItem("Id");

  const [mess, setMess] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch mess profile on mount / id change
  useEffect(() => {
    const fetchMess = async () => {
      try {
        const res = await api.get(`/Profile/Messprofile/${id}`);
        const d = res?.data?.data;
        setMess(d);

        console.log("Mess Data:", d);
        console.log("Sender ID:", senderid);
        console.log("Accepted List:", d?.accepted);
        console.log("Requesters List:", d?.requesters);

        if (d && senderid) {
          // Use String() to ensure we compare strings vs ObjectIds correctly
          const isAccepted = d.accepted?.some(
            (uid) => String(uid) === String(senderid)
          );
          const isPaymentPending = d.payment_pending?.some(
            (uid) => String(uid) === String(senderid)
          );
          const isPending = d.requesters?.some(
            (uid) => String(uid) === String(senderid)
          );

          console.log("DEBUG MessReq:", {
            messId: id,
            userId: senderid,
            isAccepted,
            isPaymentPending,
            isPending,
          });

          if (isAccepted) setStatus("accepted");
          else if (isPaymentPending) setStatus("payment_pending");
          else if (isPending) setStatus("pending");
          else setStatus(null);
        }
      } catch (err) {
        console.error("Failed to fetch mess profile:", err);
        toast.error("Unable to load mess details.");
      }
    };

    fetchMess();
  }, [id, senderid]);

  const handleAccept = async () => {
    setLoading(true);
    try {
      const response = await api.post(`/Mess/accept/${id}`, {
        userId: senderid,
      });
      console.log("Accept response:", response);
      toast.success("Request accepted.");
      setStatus("accepted");
    } catch (err) {
      console.error("Accept error:", err);
      toast.error("Failed to accept request.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      const response = await api.post(`/Mess/reject/${id}`, {
        userId: senderid,
      });
      console.log("Reject response:", response);
      toast.success("Request rejected.");
      setStatus(null);
    } catch (err) {
      console.error("Reject error:", err);
      toast.error("Failed to reject request.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    setLoading(true);
    try {
      const response = await api.post(`/Mess/pay/${id}`, {
        userId: senderid,
      });
      console.log("Payment response:", response);
      toast.success("Payment completed.");
      setStatus("accepted");
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  const renderActionButtons = () => {
    if (!mess) return null;

    switch (status) {
      case "accepted":
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle size={20} />
            <span>Accepted</span>
          </div>
        );
      case "payment_pending":
        return (
          <PayButton
            amount={mess?.price || 0}
            onSuccess={handlePaymentSuccess}
            disabled={loading}
          />
        );
      case "pending":
        return (
          <div className="flex gap-3">
            <button
              onClick={handleAccept}
              disabled={loading}
              className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              <CheckCircle size={16} />
              Accept
            </button>
            <button
              onClick={handleReject}
              disabled={loading}
              className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              <XCircle size={16} />
              Reject
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <button
        onClick={goBack}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
      >
        <ArrowLeft size={20} />
        <span className="ml-1">Back</span>
      </button>

      {mess ? (
        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <UtensilsCrossed size={24} className="mr-2" />
            {mess.name}
          </h2>

          <p className="mb-2 flex items-center">
            <User size={18} className="mr-2" />
            Owner: {mess.owner?.name || "N/A"}
          </p>

          <p className="mb-2 flex items-center">
            <Clock size={18} className="mr-2" />
            Open Hours: {mess.openHours || "N/A"}
          </p>

          <p className="mb-4 flex items-center">
            <CreditCard size={18} className="mr-2" />
            Price per day: ₹{mess.price || "0"}
          </p>

          <div className="mt-6">{renderActionButtons()}</div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-48">
          <RotateCcw className="animate-spin mr-2" size={24} />
          Loading mess details...
        </div>
      )}
    </div>
  );
};

export default MessReq;