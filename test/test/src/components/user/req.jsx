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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Hostel Request</h2>
            <p className="text-sm text-gray-500 mt-1">Hostel id: <span className="font-medium text-gray-700">{id}</span></p>
          </div>
          <div className="text-sm text-right">
            <p className="text-xs text-gray-400">Sender</p>
            <p className="font-medium">{senderid ?? "Not logged in"}</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-gray-600">
            Click the button below to send a hostel request to the owner. You’ll be notified when the owner
            responds.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleClick}
              disabled={loading || !senderid}
              className={`inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium shadow-sm focus:outline-none
                ${loading || !senderid
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"}
              `}
            >
              {loading ? (
                <svg
                  className="animate-spin h-4 w-4 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              ) : null}
              {loading ? "Sending..." : "Send Request"}
            </button>

            <button
              onClick={() => {
                setStatus(null);
              }}
              className="px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              Reset
            </button>
          </div>

          <div className="mt-4">
            <span className="text-sm text-gray-500">Status:</span>
            <div className="mt-2">
              {status === null && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  Not sent
                </span>
              )}
              {status === "pending" && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              )}
              {status === "accepted" && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Accepted
                </span>
              )}
              {status === "rejected" && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Rejected
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-400">
            Tip: make sure your backend is running at <code>http://localhost:3000</code> and the endpoint
            <code className="mx-1">/Profile/Hostelrequest/:hostelId/:senderId</code> accepts POST.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Req;
