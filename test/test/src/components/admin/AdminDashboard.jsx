import { useState, useEffect } from "react";
import api from "../../lib/api";
import { toast } from "sonner";
import { Users, Building2, AlertCircle, Trash2, Ban, CheckCircle, Loader2, FileText } from "lucide-react";

export const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("stats");

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const res = await api.get("/api/v1/admin/stats");
            setStats(res.data.data);
        } catch (e) {
            toast.error("Failed to load stats");
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/v1/admin/users");
            setUsers(res.data.data);
        } catch (e) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const loadComplaints = async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/v1/admin/complaints");
            setComplaints(res.data.data);
        } catch (e) {
            toast.error("Failed to load complaints");
        } finally {
            setLoading(false);
        }
    };

    const toggleBan = async (userId) => {
        if (!confirm("Are you sure you want to change ban status?")) return;
        try {
            await api.patch(`/api/v1/admin/users/${userId}/ban`);
            toast.success("User status updated");
            loadUsers();
        } catch (e) {
            toast.error("Failed to update user status");
        }
    };

    const deleteComplaint = async (id) => {
        if (!confirm("Are you sure you want to delete this complaint?")) return;
        try {
            await api.delete(`/api/v1/admin/complaints/${id}`);
            toast.success("Complaint deleted");
            loadComplaints();
        } catch (e) {
            toast.error("Failed to delete complaint");
        }
    };

    const [updates, setUpdates] = useState([]);

    const loadUpdates = async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/v1/admin/updates/pending");
            setUpdates(res.data.data);
        } catch (e) {
            toast.error("Failed to load updates");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id, action) => {
        if (!confirm(`Are you sure you want to ${action} this update?`)) return;
        try {
            await api.patch(`/api/v1/admin/updates/${id}/${action}`);
            toast.success(`Update ${action}d`);
            loadUpdates();
        } catch (e) {
            toast.error(`Failed to ${action} update`);
        }
    };

    useEffect(() => {
        if (activeTab === "users") loadUsers();
        if (activeTab === "complaints") loadComplaints();
        if (activeTab === "updates") loadUpdates();
    }, [activeTab]);

    if (loading && !stats) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-6xl mx-auto space-y-6 p-6">
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard 🛡️</h1>

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-slate-200 pb-2">
                <button
                    onClick={() => setActiveTab("stats")}
                    className={`px-4 py-2 font-medium ${activeTab === "stats" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500"}`}
                >
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab("users")}
                    className={`px-4 py-2 font-medium ${activeTab === "users" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500"}`}
                >
                    User Management
                </button>
                <button
                    onClick={() => setActiveTab("complaints")}
                    className={`px-4 py-2 font-medium ${activeTab === "complaints" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500"}`}
                >
                    Content Moderation
                </button>
                <button
                    onClick={() => setActiveTab("updates")}
                    className={`px-4 py-2 font-medium ${activeTab === "updates" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500"}`}
                >
                    Profile Approvals
                </button>
            </div>

            {/* Stats View */}
            {activeTab === "stats" && stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard title="Total Users" value={stats.users.total} icon={Users} color="blue" />
                    <StatCard title="Students" value={stats.users.students} icon={Users} color="green" />
                    <StatCard title="Mess Owners" value={stats.users.mess} icon={Users} color="orange" />
                    <StatCard title="Hostel Owners" value={stats.users.hostels} icon={Building2} color="purple" />
                    <StatCard title="Total Complaints" value={stats.complaints.total} icon={AlertCircle} color="red" />
                    <StatCard title="Active Complaints" value={stats.complaints.active} icon={AlertCircle} color="yellow" />
                </div>
            )}

            {/* Users View */}
            {activeTab === "users" && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map(u => (
                                <tr key={u._id} className="hover:bg-slate-50">
                                    <td className="p-4 font-medium text-slate-900">{u.username}</td>
                                    <td className="p-4 capitalize">{u.role}</td>
                                    <td className="p-4">{u.email}</td>
                                    <td className="p-4">
                                        {u.isBanned ? (
                                            <span className="text-red-600 font-bold flex items-center gap-1"><Ban size={14} /> Banned</span>
                                        ) : (
                                            <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle size={14} /> Active</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {u.role !== 'admin' && (
                                            <button
                                                onClick={() => toggleBan(u._id)}
                                                className={`px-3 py-1 rounded text-xs font-bold ${u.isBanned ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                            >
                                                {u.isBanned ? "Unban" : "Ban"}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Complaints View */}
            {activeTab === "complaints" && (
                <div className="space-y-4">
                    {complaints.map(c => (
                        <div key={c._id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-slate-900 capitalize">{c.category} Issue</h3>
                                <p className="text-slate-600 mt-1">{c.description}</p>
                                <div className="text-xs text-slate-400 mt-2">
                                    Raised by: {c.raisedBy?.username || "Unknown"} • {new Date(c.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            <button
                                onClick={() => deleteComplaint(c._id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Complaint"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Updates View */}
            {activeTab === "updates" && (
                <div className="space-y-4">
                    {updates.length === 0 && <p className="text-slate-500 text-center py-10">No pending updates</p>}
                    {updates.map(u => (
                        <div key={u._id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-slate-900">{u.userId?.username} <span className="text-xs font-normal text-slate-500">({u.role})</span></h3>
                                    <p className="text-xs text-slate-400">Requested: {new Date(u.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleUpdate(u._id, "approve")}
                                        className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded hover:bg-green-700"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleUpdate(u._id, "reject")}
                                        className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded text-sm font-mono text-slate-700 overflow-x-auto">
                                <pre>{JSON.stringify(u.updates, null, 2)}</pre>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`p-6 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-4 border-l-4 border-${color}-500`}>
        <div className={`p-3 rounded-full bg-${color}-50 text-${color}-600`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        </div>
    </div>
);
