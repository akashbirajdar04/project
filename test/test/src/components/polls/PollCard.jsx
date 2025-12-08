import React, { useState } from 'react';
import { CheckCircle2, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../lib/api';

const PollCard = ({ poll, onVote }) => {
    const [voting, setVoting] = useState(false);
    const { question, options, votes, totalVotes, hasVoted, expiresAt } = poll;

    const handleVote = async (option) => {
        if (hasVoted) return;

        setVoting(true);
        try {
            const res = await api.post(`/api/v1/polls/${poll._id}/vote`, { option });
            toast.success("Vote cast successfully!");
            if (onVote) onVote(res.data.data);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to vote");
        } finally {
            setVoting(false);
        }
    };

    const getPercentage = (option) => {
        if (totalVotes === 0) return 0;
        const count = votes[option] || 0;
        return Math.round((count / totalVotes) * 100);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">{question}</h3>

            <div className="space-y-3">
                {options.map((option) => (
                    <div key={option} className="relative">
                        {hasVoted ? (
                            // Result View
                            <div className="relative h-12 bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
                                <div
                                    className="absolute top-0 left-0 h-full bg-blue-100 transition-all duration-500"
                                    style={{ width: `${getPercentage(option)}%` }}
                                />
                                <div className="absolute inset-0 flex items-center justify-between px-4">
                                    <span className="font-medium text-slate-700 z-10">{option}</span>
                                    <span className="text-sm font-semibold text-slate-600 z-10">
                                        {getPercentage(option)}% ({votes[option] || 0})
                                    </span>
                                </div>
                            </div>
                        ) : (
                            // Voting View
                            <button
                                onClick={() => handleVote(option)}
                                disabled={voting}
                                className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-slate-700 group-hover:text-blue-700">{option}</span>
                                    <div className="h-5 w-5 rounded-full border-2 border-slate-300 group-hover:border-blue-500" />
                                </div>
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {totalVotes} votes
                    </span>
                    {expiresAt && (
                        <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Ends {new Date(expiresAt).toLocaleDateString()}
                        </span>
                    )}
                </div>
                {hasVoted && (
                    <span className="flex items-center gap-1 text-green-600 font-medium">
                        <CheckCircle2 className="h-4 w-4" />
                        Voted
                    </span>
                )}
            </div>
        </div>
    );
};

export default PollCard;
