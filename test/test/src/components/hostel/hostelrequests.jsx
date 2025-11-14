import { useEffect, useState } from "react";
import axios from "axios";

export const Hostelrequest = () => {
  const [requests, setRequests] = useState([]);
  const id = localStorage.getItem("Id");

  useEffect(() => {
    axios
      .get(`http://localhost:3000/Profile/Hostelrequest/${id}`)
      .then((res) => setRequests(res.data.data))
      .catch((err) => {
        console.error("Error fetching requests:", err);
        alert("Error fetching requests");
      });
  }, [id]);

  const handleAccept = async (reqId) => {
    try {
      await axios.put(`http://localhost:3000/Profile/Hostelrequest/${id}/accept`);
      setRequests((prev) => prev.filter((r) => r._id !== reqId));
      alert("Request accepted");
    } catch (err) {
      console.error("Error accepting request:", err);
      alert("Error accepting request");
    }
  };

  const handleReject = async (reqId) => {
    try {
      await axios.put(`http://localhost:3000/Profile/Hostelrequest/${reqId}/reject`);
      setRequests((prev) => prev.filter((r) => r._id !== reqId));
      alert("Request rejected");
    } catch (err) {
      console.error("Error rejecting request:", err);
      alert("Error rejecting request");
    }
  };

  if (requests.length === 0) {
    return (
      <h1 className="text-center mt-10 text-lg font-medium text-gray-700">
        There are no requests
      </h1>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-6 p-4 space-y-4">
      <h2 className="text-2xl font-bold text-indigo-700 text-center mb-4">
        Pending Requests
      </h2>

      {requests.map((reqq) => (
        <div
          key={reqq}
          className="p-4 border rounded-2xl shadow-md flex justify-between items-center hover:scale-105 transition-transform bg-white"
        >
          <p className="text-gray-800">
            Request from:{" "}
            <strong>{reqq.fromUser?.username || "Unknown"}</strong>
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => handleAccept(reqq)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-semibold transition-all"
            >
              Accept
            </button>

            <button
              onClick={() => handleReject(reqq)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold transition-all"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
