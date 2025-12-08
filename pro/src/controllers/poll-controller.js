import { Poll } from "../models/poll.js";
import { Student } from "../models/user.module.js";
import mongoose from "mongoose";
import { redisClient } from "../config/redis.js";

export const createPoll = async (req, res) => {
    try {
        const { question, options, scope: requestedScope, expiresAt } = req.body;

        if (!question || !options || !Array.isArray(options) || options.length < 2) {
            return res.status(400).json({ success: false, message: "Question and at least 2 options are required" });
        }

        let scope = requestedScope || "global";
        // Enforce scope based on role
        if (req.user.role === "messowner") scope = "mess";
        if (req.user.role === "hostelowner") scope = "hostel";

        // Initialize votes map
        const votesMap = {};
        options.forEach(opt => votesMap[opt] = 0);

        const poll = await Poll.create({
            question,
            options,
            votes: votesMap,
            createdBy: req.user._id,
            scope,
            expiresAt
        });

        // Invalidate cache
        try {
            await redisClient.incr(`polls_version_${scope}`);
            if (scope === "global") await redisClient.incr(`polls_version_global`);
        } catch (err) {
            console.error("Redis error:", err);
        }

        res.status(201).json({ success: true, data: poll });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const listPolls = async (req, res) => {
    try {
        const { scope } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const userId = req.user._id;
        const role = req.user.role;

        let filter = {};

        if (role === "student") {
            const student = await Student.findById(userId);
            const conditions = [{ scope: "global" }];

            if (student?.messid) {
                conditions.push({ scope: "mess", createdBy: student.messid });
            }
            if (student?.hostelid) {
                if (Array.isArray(student.hostelid)) {
                    conditions.push({ scope: "hostel", createdBy: { $in: student.hostelid } });
                } else {
                    conditions.push({ scope: "hostel", createdBy: student.hostelid });
                }
            }

            if (scope && scope !== "all") {
                if (scope === "mess" && student?.messid) {
                    filter.scope = "mess";
                    filter.createdBy = student.messid;
                } else if (scope === "hostel" && student?.hostelid) {
                    filter.scope = "hostel";
                    filter.createdBy = Array.isArray(student.hostelid) ? { $in: student.hostelid } : student.hostelid;
                } else if (scope === "global") {
                    filter.scope = "global";
                } else {
                    return res.json({ success: true, data: [] });
                }
            } else {
                filter.$or = conditions;
            }

            filter.voters = { $ne: userId };

        } else {
            const ownerConditions = [
                { createdBy: userId },
                { scope: "global" }
            ];

            if (scope && scope !== "all") {
                if (scope === "global") filter.scope = "global";
                else {
                    filter.scope = scope;
                    filter.createdBy = userId;
                }
            } else {
                filter.$or = ownerConditions;
            }
        }

        // Redis Caching
        const cacheScope = scope || "all";
        let version = "1";
        try {
            const versionKey = `polls_version_${role === 'student' ? 'student' : 'owner'}`;
            version = await redisClient.get(versionKey) || "1";

            const cacheKey = `polls:${userId}:${role}:scope:${cacheScope}:p:${page}:l:${limit}:v:${version}_v2`;
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                return res.json(JSON.parse(cachedData));
            }
        } catch (err) {
            console.error("Redis error:", err);
        }

        const polls = await Poll.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("-__v -updatedAt")
            .lean();

        const totalPolls = await Poll.countDocuments(filter);
        const totalPages = Math.ceil(totalPolls / limit);

        const pollsWithStatus = polls.map(p => {
            const obj = { ...p };
            obj.hasVoted = p.voters ? p.voters.map(v => v.toString()).includes(userId.toString()) : false;

            let totalVotes = 0;
            if (p.votes) {
                for (const count of Object.values(p.votes)) {
                    totalVotes += count;
                }
            }
            obj.totalVotes = totalVotes;
            return obj;
        });

        const responseData = {
            success: true,
            data: pollsWithStatus,
            page,
            totalPages,
            totalPolls
        };

        try {
            const versionKey = `polls_version_${role === 'student' ? 'student' : 'owner'}`;
            const version = await redisClient.get(versionKey) || "1";
            const cacheKey = `polls:${userId}:${role}:scope:${cacheScope}:p:${page}:l:${limit}:v:${version}_v2`;
            await redisClient.setEx(cacheKey, 300, JSON.stringify(responseData));
        } catch (err) {
            console.error("Redis set error:", err);
        }

        res.json(responseData);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const votePoll = async (req, res) => {
    try {
        const { id } = req.params;
        const { option } = req.body;
        const userId = req.user._id;

        const pollIdObj = new mongoose.Types.ObjectId(id);
        const poll = await Poll.findById(pollIdObj);
        if (!poll) return res.status(404).json({ success: false, message: "Poll not found" });

        if (poll.voters.includes(userId)) {
            return res.status(400).json({ success: false, message: "You have already voted" });
        }

        if (!poll.options.includes(option)) {
            return res.status(400).json({ success: false, message: "Invalid option" });
        }

        const currentVotes = poll.votes.get(option) || 0;
        poll.votes.set(option, currentVotes + 1);

        poll.voters.push(userId);

        await poll.save();

        try {
            await redisClient.incr(`polls_version_${poll.scope}`);
            if (poll.scope === "global") await redisClient.incr(`polls_version_global`);
        } catch (err) {
            console.error("Redis error:", err);
        }

        res.json({ success: true, message: "Vote cast successfully", data: poll.toObject({ flattenMaps: true }) });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
