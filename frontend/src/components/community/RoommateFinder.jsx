import { useState, useEffect } from "react";
import api from "../../lib/api";
import { toast } from "sonner";
import { User, Phone, BookOpen, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export const RoommateFinder = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalStudents, setTotalStudents] = useState(0);
    const limit = 9; // Grid layout 3x3

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await api.get("/student/looking", {
                params: { page, limit, search }
            });
            if (res.data.success) {
                setStudents(res.data.data);
                setPage(res.data.page);
                setTotalPages(res.data.totalPages);
                setTotalStudents(res.data.totalStudents);
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load students");
        } finally {
            setLoading(false);
        }
    };

    // Debounce search and reload
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchStudents();
        }, 500);
        return () => clearTimeout(timer);
    }, [page, search]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Find a Roommate</h1>
                    <p className="text-slate-500 mt-1">Connect with other students looking for accommodation</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, course..."
                        value={search}
                        onChange={handleSearchChange}
                        className="pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                    />
                </div>
            </div>

            {loading && students.length === 0 ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
            ) : (
                <>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {students.map((student) => (
                            <div key={student._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                                            {student.avatar?.url ? (
                                                <img
                                                    src={student.avatar.url}
                                                    alt={student.username}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                    <User size={32} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg text-slate-900">{student.username}</h3>
                                            <div className="flex items-center text-sm text-slate-500">
                                                <BookOpen size={14} className="mr-1" />
                                                <span>{student.course} {student.year ? `- Year ${student.year}` : ''}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="bg-slate-50 p-3 rounded-lg">
                                            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Preferences</div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <span className="text-slate-500">Budget:</span>
                                                    <span className="ml-1 font-medium text-slate-700">{student.preferences?.budget || 'N/A'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-500">Gender:</span>
                                                    <span className="ml-1 font-medium text-slate-700 capitalize">{student.preferences?.gender || 'Any'}</span>
                                                </div>
                                                <div className="col-span-2">
                                                    <span className="text-slate-500">Lifestyle:</span>
                                                    <span className="ml-1 font-medium text-slate-700">{student.preferences?.lifestyle || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {student.contact && (
                                            <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                                                <Phone size={16} />
                                                <span className="font-medium">{student.contact}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {students.length === 0 && (
                            <div className="col-span-full text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                <User className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                                <h3 className="text-lg font-medium text-slate-900">No students found</h3>
                                <p className="text-slate-500">
                                    {search ? `No results for "${search}"` : "Be the first to update your profile and look for a roommate!"}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {students.length > 0 && (
                        <div className="flex items-center justify-between mt-8 border-t border-slate-200 pt-4">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1 || loading}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={16} />
                                Previous
                            </button>

                            <span className="text-sm text-slate-600 font-medium">
                                Page {page} of {totalPages} ({totalStudents} students)
                            </span>

                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages || loading}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
