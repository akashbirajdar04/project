import { useState, useEffect } from "react";
import api from "../../lib/api";
import { toast } from "sonner";
import { User, Phone, Mail, Calendar } from "lucide-react";

export const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await api.get("/api/v1/roommate/all");
            if (res.data.success) {
                setStudents(res.data.data);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load students");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-10 text-center text-slate-500">Loading students...</div>;
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">Student Directory</h1>
            <p className="text-slate-600 mb-8">Connect with other students looking for roommates.</p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {students.map((req) => (
                    <div key={req._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">{req.userId?.username || "Student"}</h3>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                        {req.gender}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-600 italic">
                                    "{req.preferences}"
                                </div>

                                <div className="pt-4 border-t border-slate-100 space-y-2">
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <Phone size={16} className="text-slate-400" />
                                        <span>{req.contactInfo}</span>
                                    </div>
                                    {req.userId?.email && (
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <Mail size={16} className="text-slate-400" />
                                            <span>{req.userId.email}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 text-sm text-slate-500">
                                        <Calendar size={16} className="text-slate-400" />
                                        <span>Posted {new Date(req.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {students.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <User size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">No students found</h3>
                        <p className="text-slate-500">Check back later for new roommate requests.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
