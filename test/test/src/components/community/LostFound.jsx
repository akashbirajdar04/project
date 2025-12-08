import { useState, useEffect } from "react";
import api from "../../lib/api";
import { toast } from "sonner";
import { MapPin, Tag, CheckCircle } from "lucide-react";

export const LostFound = ({ hostelId }) => {
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState("All");
    const [newItem, setNewItem] = useState({
        title: "",
        description: "",
        type: "Lost",
        location: "",
        contactInfo: "",
        image: "",
    });
    const currentUserId = localStorage.getItem("Id");

    const [currentHostelId, setCurrentHostelId] = useState(hostelId);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (hostelId) {
            setCurrentHostelId(hostelId);
            setLoading(false);
        } else {
            // Fetch user's enrolled hostel
            const fetchHostel = async () => {
                try {
                    const res = await api.get(`/Profile/student/${currentUserId}/hostel`);
                    const data = res.data?.data;
                    const hId = Array.isArray(data) ? data[0]?._id : data?._id;
                    if (hId) setCurrentHostelId(hId);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            if (currentUserId) fetchHostel();
            else setLoading(false);
        }
    }, [hostelId, currentUserId]);

    useEffect(() => {
        if (currentHostelId) {
            fetchItems();
        }
    }, [currentHostelId]);

    const fetchItems = async () => {
        if (!currentHostelId) return;
        try {
            const res = await api.get(`/api/v1/lost-found/hostel/${currentHostelId}`);
            if (res.data.success) {
                setItems(res.data.data);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load items");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentHostelId) {
            toast.error("You must be enrolled in a hostel to post.");
            return;
        }
        try {
            const res = await api.post("/api/v1/lost-found/create", {
                ...newItem,
                userId: currentUserId,
                hostelId: currentHostelId,
            });
            if (res.data.success) {
                toast.success("Item posted!");
                setNewItem({ title: "", description: "", type: "Lost", location: "", contactInfo: "", image: "" });
                fetchItems();
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to post item");
        }
    };

    const handleResolve = async (id) => {
        try {
            await api.put(`/api/v1/lost-found/resolve/${id}`);
            toast.success("Marked as resolved");
            fetchItems();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update status");
        }
    };

    const filteredItems = filter === "All" ? items : items.filter((i) => i.type === filter);

    if (loading) {
        return <div className="p-10 text-center text-slate-500">Loading...</div>;
    }

    if (!currentHostelId) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold text-slate-800 mb-2">Hostel Not Found</h2>
                <p className="text-slate-600">You need to be enrolled in a hostel to view and post Lost & Found items.</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">Lost & Found</h1>

            {/* Post Form */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-slate-100">
                <h2 className="text-lg font-semibold mb-4">Report an Item</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={newItem.title}
                            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                            placeholder="Blue Backpack"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            value={newItem.description}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                            placeholder="Describe the item..."
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                        <select
                            value={newItem.type}
                            onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="Lost">Lost</option>
                            <option value="Found">Found</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                        <input
                            type="text"
                            value={newItem.location}
                            onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                            placeholder="Library, Canteen..."
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Contact Info</label>
                        <input
                            type="text"
                            value={newItem.contactInfo}
                            onChange={(e) => setNewItem({ ...newItem, contactInfo: e.target.value })}
                            placeholder="Phone or Email"
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Image URL (Optional)</label>
                        <input
                            type="text"
                            value={newItem.image}
                            onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                            placeholder="https://..."
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Post Item
                        </button>
                    </div>
                </form>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
                {["All", "Lost", "Found"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === f ? "bg-slate-800 text-white" : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                    <div key={item._id} className="bg-white rounded-lg shadow overflow-hidden border border-slate-100 flex flex-col">
                        {item.image && (
                            <div className="h-48 bg-slate-100 overflow-hidden">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="p-4 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <span
                                    className={`px-2 py-1 rounded text-xs font-bold uppercase ${item.type === "Lost" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                        }`}
                                >
                                    {item.type}
                                </span>
                                {item.status === "Resolved" && (
                                    <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
                                        <CheckCircle size={14} /> Resolved
                                    </span>
                                )}
                            </div>
                            <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                            <p className="text-slate-600 text-sm mb-4 flex-1">{item.description}</p>

                            <div className="space-y-2 text-sm text-slate-500">
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} /> {item.location || "Unknown location"}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Tag size={16} /> Contact: {item.contactInfo}
                                </div>
                            </div>

                            {item.userId?._id === currentUserId && item.status !== "Resolved" && (
                                <button
                                    onClick={() => handleResolve(item._id)}
                                    className="mt-4 w-full bg-slate-100 text-slate-700 py-2 rounded hover:bg-slate-200 transition-colors text-sm font-medium"
                                >
                                    Mark as Resolved
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {filteredItems.length === 0 && (
                    <p className="col-span-full text-center text-slate-500 py-10">No items found.</p>
                )}
            </div>
        </div>
    );
};
