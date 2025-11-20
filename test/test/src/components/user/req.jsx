import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export const Req = () => {
  const { id } = useParams();
  const senderid = localStorage.getItem("Id");

  const [status, setStatus] = useState(null); // "pending" | "accepted" | "rejected" | null
  const [loading, setLoading] = useState(false);
 console.log(id)
 console.log(senderid)
  const handleClick = async () => {
    if (!senderid) {
      alert("You must be logged in to send a request.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
    `http://localhost:3000/Profile/Hostelrequest/${id}/${senderid}`,{}
      );
      // you can use response data if needed: res.data
      setStatus("pending");
      alert("Request sent.");
    } catch (err) {
      console.error(err);
      alert("Cannot send the request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 animate-fadeIn">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Hostel Request</h2>
              <p className="text-sm text-slate-500 mt-1">Hostel ID: <span className="font-medium text-slate-700">{id}</span></p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-slate-700 leading-relaxed">
              Click the button below to send a hostel request to the owner. You'll be notified when the owner responds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleClick}
              disabled={loading || !senderid}
              className={`flex-1 inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold shadow-lg focus:outline-none transition-all transform hover:-translate-y-0.5
                ${loading || !senderid
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl"}
              `}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                "Send Request"
              )}
            </button>

            <button
              onClick={() => {
                setStatus(null);
              }}
              className="px-4 py-3.5 text-sm rounded-xl border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all font-medium"
            >
              Reset
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-sm font-semibold text-slate-700 mb-3 block">Status:</span>
            <div className="mt-2">
              {status === null && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  Not sent
                </span>
              )}
              {status === "pending" && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                  ⏳ Pending
                </span>
              )}
              {status === "accepted" && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ✓ Accepted
                </span>
              )}
              {status === "rejected" && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-red-100 text-red-800 border border-red-200">
                  ✗ Rejected
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Req;
