import { useState } from "react";
import axios from "axios";

export const Hostelprofile = () => {
  const [name, setName] = useState("");
  const [adress, setAdress] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const id = localStorage.getItem("Id");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:3000/Profile/Hostelprofile", {
        name,
        adress,
        price,
        id,
      });
      setMessage(res.data.message);
      setName("");
      setAdress("");
      setPrice("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Hostel Profile</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter the hostel name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Enter the address"
          value={adress}
          onChange={(e) => setAdress(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Enter the price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
};
