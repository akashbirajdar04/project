import React, { useEffect, useState } from 'react';
import { Loader2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../lib/api';
import PollCard from './PollCard';
import CreatePollModal from './CreatePollModal';
import { toast } from 'sonner';

const PollList = () => {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState('all'); // all, mess, hostel, global
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPolls, setTotalPolls] = useState(0);
    const limit = 10;

    const role = localStorage.getItem('role');
    const canCreate = role === 'messowner' || role === 'hostelowner';

    const fetchPolls = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/api/v1/polls`, {
                params: { scope: filter, page, limit }
            });
            setPolls(res.data.data);
            setPage(res.data.page || 1);
            setTotalPages(res.data.totalPages || 1);
            setTotalPolls(res.data.totalPolls || 0);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load polls");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPolls();
    }, [filter, page]);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setPage(1);
    };

    const handlePollCreated = (newPoll) => {
        setPolls([newPoll, ...polls]);
        setIsModalOpen(false);
        fetchPolls(); // Refresh to ensure correct order/pagination
    };

    const handleVoteUpdate = (updatedPoll) => {
        // Remove the voted poll from the list
        setPolls(polls.filter(p => p._id !== updatedPoll._id));
        setTotalPolls(prev => prev - 1);
        toast.success("Poll removed from list");
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Community Polls</h2>
                    <p className="text-slate-500">Vote on important community decisions</p>
                </div>
                {canCreate && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Create Poll
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['all', 'global', 'mess', 'hostel'].map((f) => (
                    <button
                        key={f}
                        onClick={() => handleFilterChange(f)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === f
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                </div>
            ) : polls.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-slate-500">No active polls found</p>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {polls.map((poll) => (
                            <PollCard key={poll._id} poll={poll} onVote={handleVoteUpdate} />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between mt-6 border-t border-slate-200 pt-4">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1 || loading}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={16} />
                            Previous
                        </button>

                        <span className="text-sm text-slate-600 font-medium">
                            Page {page} of {totalPages} ({totalPolls} polls)
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
                </>
            )}

            {isModalOpen && (
                <CreatePollModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onCreated={handlePollCreated}
                />
            )}
        </div>
    );
};

export default PollList;
