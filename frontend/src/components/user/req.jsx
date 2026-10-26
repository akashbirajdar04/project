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

          if (isAccepted) {
            setStatus("accepted");
          } else if (isPaymentPending) {
            setStatus("payment_pending");
          } else if (isPending) {
            setStatus("pending");
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load hostel details");
      }
    };

    if (id) {
      fetchHostel();
    }
  }, [id, senderid]);

  const handleAccept = async () => {
    setLoading(true);
    try {
      await api.post(`/hostel/${id}/accept`, { userId: senderid });
      toast.success("Request accepted");
      setStatus("accepted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to accept request");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await api.post(`/hostel/${id}/reject`, { userId: senderid });
      toast.success("Request rejected");
      setStatus("rejected");
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject request");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      await api.post(`/hostel/${id}/cancel`, { userId: senderid });
      toast.success("Request cancelled");
      setStatus(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel request");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      await api.post(`/hostel/${id}/pay`, { userId: senderid });
      toast.success("Payment successful");
      setStatus("accepted");
    } catch (error) {
      console.error(error);
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => navigate(-1);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <button
        onClick={goBack}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
      >
        <ArrowLeft className="mr-2" />
        Back
      </button>

      {hostel ? (
        <div className="border rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <Building2 className="mr-2" />
            <h2 className="text-2xl font-semibold">{hostel.name}</h2>
          </div>

          <p className="mb-4">{hostel.description}</p>

          {status === "accepted" && (
            <div className="flex items-center text-green-600 mb-4">
              <CheckCircle className="mr-2" />
              <span>Request accepted</span>
            </div>
          )}

          {status === "payment_pending" && (
            <div className="flex items-center text-yellow-600 mb-4">
              <Clock className="mr-2" />
              <span>Payment pending</span>
            </div>
          )}

          {status === "pending" && (
            <div className="flex items-center text-blue-600 mb-4">
              <Send className="mr-2" />
              <span>Request pending</span>
            </div>
          )}

          <div className="flex space-x-3 mt-6">
            {status === "pending" && (
              <>
                <button
                  onClick={handleAccept}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  <CheckCircle className="mr-2" size={16} />
                  Accept
                </button>
                <button
                  onClick={handleReject}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  <XCircle className="mr-2" size={16} />
                  Reject
                </button>
              </>
            )}

            {status === "payment_pending" && (
              <PayButton
                onSuccess={handlePayment}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                <CreditCard className="mr-2" size={16} />
                Pay Now
              </PayButton>
            )}

            {(status === "pending" || status === "payment_pending") && (
              <button
                onClick={handleCancel}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                <RotateCcw className="mr-2" size={16} />
                Cancel Request
              </button>
            )}
          </div>
        </div>
      ) : (
        <p>Loading hostel information...</p>
      )}
    </div>
  );
};

export default Req;