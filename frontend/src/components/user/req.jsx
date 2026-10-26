import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import {
  Send,
  ArrowLeft,
  Building2,
  User,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import PayButton from "../payment";

export const Req = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const senderid = localStorage.getItem("Id");

  const [hostel, setHostel] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load hostel details
  useEffect(() => {
    const fetchHostel = async () => {
      try {
        const res = await api.get(`/hostel/${id}/profile`);
        const d = res.data?.data;
        setHostel(d);

        if (d && senderid) {
          const isAccepted = d.accepted?.some(
            (uid) => String(uid) === String(senderid)
          );
          const isPaymentPending = d.payment_pending?.some(
            (uid) => String(uid) === String(senderid)
          );
          const isPending = d.requesters?.some(
            (uid) => String(uid) === String(senderid)
          );

          console.log("DEBUG Req:", {
            hostelId: id,
            userId: senderid,
            isAccepted,
            isPaymentPending,
            isPending,
            paymentPendingList: d.payment_pending,
          });

          if (isAccepted) setStatus("accepted");
          else if (isPaymentPending) setStatus("payment_pending");
          else if (isPending) setStatus("pending");
        }
      } catch (error) {
        console.error("Failed to load hostel details:", error);
        toast.error("Failed to load hostel details");
      }
    };

    if (id) fetchHostel();
  }, [id, senderid]);

  // Send request to stay
  const handleRequest = async () => {
    if (!hostel) return;
    setLoading(true);
    try {
      await api.post(`/hostel/${id}/request`, { userId: senderid });
      setStatus("pending");
      toast.success("Request sent successfully");
    } catch (error) {
      console.error("Request error:", error);
      toast.error("Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  // Cancel request
  const handleCancel = async () => {
    setLoading(true);
    try {
      await api.delete(`/hostel/${id}/request`, {
        data: { userId: senderid },
      });
      setStatus(null);
      toast.success("Request cancelled");
    } catch (error) {
      console.error("Cancel error:", error);
      toast.error("Failed to cancel request");
    } finally {
      setLoading(false);
    }
  };

  // Pay for pending payment
  const handlePaymentSuccess = async () => {
    setLoading(true);
    try {
      await api.post(`/hostel/${id}/pay`, { userId: senderid });
      setStatus("accepted");
      toast.success("Payment successful");
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  // UI helpers
  const renderAction = () => {
    if (loading) return <Clock className="animate-spin" />;

    switch (status) {
      case "pending":
        return (
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded"
          >
            <XCircle size={18} />
            Cancel Request
          </button>
        );
      case "payment_pending":
        return (
          <PayButton
            amount={hostel?.price || 0}
            onSuccess={handlePaymentSuccess}
            disabled={loading}
          />
        );
      case "accepted":
        return (
          <button
            disabled
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded"
          >
            <CheckCircle size={18} />
            Accepted
          </button>
        );
      default:
        return (
          <button
            onClick={handleRequest}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            <Send size={18} />
            Send Request
          </button>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 mb-4"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      {hostel ? (
        <div className="border rounded-lg p-6 shadow">
          <div className="flex items-center gap-4 mb-4">
            <Building2 size={32} />
            <h2 className="text-2xl font-semibold">{hostel.name}</h2>
          </div>

          <p className="text-gray-700 mb-2">
            <strong>Location:</strong> {hostel.location}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Price:</strong> ${hostel.price} / month
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Owner:</strong> {hostel.owner?.name || "N/A"}
          </p>

          <div className="flex items-center gap-4">{renderAction()}</div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading hostel details...</p>
      )}
    </div>
  );
};

export default Req;