import { Announcement } from "../models/announcement.js";
import { Student } from "../models/user.module.js";
import { redisClient } from "../config/redis.js";
import { notificationQueue } from "../config/queue.js";
export const createAnnouncement = async (req, res) => {
  try {
    const { title, body, scope: requestedScope, tags = [] } = req.body;
    console.log("Create Announcement Body:", req.body);
    if (!title || !body) return res.status(400).json({ success: false, message: "Title and body are required" });

    let scope = requestedScope || "global";

    // Enforce scope based on role to ensure "members only" visibility logic holds
    if (req.user.role === "messowner") scope = "mess";
    if (req.user.role === "hostelowner") scope = "hostel";

    const doc = await Announcement.create({
      title,
      body,
      scope,
      tags,
      createdBy: req.user._id
    });

    // Add to Queue for background notifications
    await notificationQueue.add({
      type: "announcement",
      announcementId: doc._id,
      scope: scope,
      creatorId: req.user._id,
      title: title,
      message: body
    });
    // Invalidate cache for this scope
    try {
      await redisClient.incr(`announcement_version_${scope}`);
      // Also invalidate global if it's a global announcement
      if (scope === "global") {
        await redisClient.incr(`announcement_version_global`);
      }
    } catch (err) {
      console.error("Redis error:", err);
    }

    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const listAnnouncements = async (req, res) => {
  try {
    console.log("Listing announcements for user:", req.user?._id, "Role:", req.user?.role);
    const { scope, q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!req.user) {
      console.log("No user found in request");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userId = req.user._id;
    const role = req.user.role;

    let filter = {};

    // Search query
    if (q) {
      const regex = { $regex: q, $options: "i" };
      filter.$or = [{ title: regex }, { body: regex }];
    }

    if (role === "student") {
      const student = await Student.findById(userId);
      console.log("Student found:", student ? "Yes" : "No");
      const conditions = [{ scope: "global" }];

      if (student?.messid) {
        conditions.push({ scope: "mess", createdBy: student.messid });
      }
      if (student?.hostelid) {
        // Handle if hostelid is array or single (based on previous code it might be array)
        if (Array.isArray(student.hostelid)) {
          conditions.push({ scope: "hostel", createdBy: { $in: student.hostelid } });
        } else {
          conditions.push({ scope: "hostel", createdBy: student.hostelid });
        }
      }

      // Apply scope filter if requested
      if (scope && scope !== "all") {
        if (scope === "mess") {
          if (student?.messid) {
            filter.scope = "mess";
            filter.createdBy = student.messid;
          } else {
            return res.json({ success: true, data: [] });
          }
        } else if (scope === "hostel") {
          if (student?.hostelid) {
            filter.scope = "hostel";
            filter.createdBy = Array.isArray(student.hostelid) ? { $in: student.hostelid } : student.hostelid;
          } else {
            return res.json({ success: true, data: [] });
          }
        } else if (scope === "global") {
          filter.scope = "global";
        }
      } else {
        // Combine search filter with visibility conditions
        if (filter.$or) {
          // If we already have a search query in $or, we need to AND it with visibility
          filter.$and = [
            { $or: filter.$or }, // (Title LIKE q OR Body LIKE q)
            { $or: conditions }  // AND (Global OR MyMess OR MyHostel)
          ];
          delete filter.$or; // Remove the top-level $or
        } else {
          filter.$or = conditions;
        }
      }

    } else {
      // For Owners/Admins: Show what they created + Global
      const ownerConditions = [
        { createdBy: userId },
        { scope: "global" }
      ];

      if (scope && scope !== "all") {
        if (scope === "global") {
          filter.scope = "global";
        } else {
          filter.scope = scope;
          filter.createdBy = userId;
        }
      } else {
        if (filter.$or) {
          filter.$and = [
            { $or: filter.$or },
            { $or: ownerConditions }
          ];
          delete filter.$or;
        } else {
          filter.$or = ownerConditions;
        }
      }
    }

    // Redis Caching
    const cacheScope = scope || "all";
    let version = "1";
    try {
      // We use a composite version based on the user's context (mess/hostel/global)
      // For simplicity, we'll use a global version for now, but ideally it should be granular
      // A better approach: If user is student, key depends on their mess/hostel versions.
      // For now, let's use a simple global version for 'all' or specific scope version.

      // Actually, let's use a simpler strategy:
      // Key depends on the requested 'scope' filter.
      // If scope is 'all' (default), we rely on a global version.

      const versionKey = `announcement_version_${role === 'student' ? 'student' : 'owner'}`; // Simplified versioning
      version = await redisClient.get(versionKey) || "1";

      // Construct a unique cache key based on ALL filters
      const cacheKey = `announcements:${userId}:${role}:scope:${cacheScope}:q:${q || ''}:p:${page}:l:${limit}:v:${version}`;

      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }
    } catch (err) {
      console.error("Redis error:", err);
    }

    console.log("Announcement Filter:", JSON.stringify(filter));
    const docs = await Announcement.find(filter)
      .populate("createdBy", "name email username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v -updatedAt")
      .lean();

    const totalAnnouncements = await Announcement.countDocuments(filter);
    const totalPages = Math.ceil(totalAnnouncements / limit);

    // Map createdBy to postedBy for frontend compatibility
    const mappedDocs = docs.map(d => {
      // d is already a plain object due to .lean()
      return { ...d, postedBy: d.createdBy };
    });

    const responseData = {
      success: true,
      data: mappedDocs,
      page,
      totalPages,
      totalAnnouncements
    };

    // Cache the result
    try {
      const versionKey = `announcement_version_${role === 'student' ? 'student' : 'owner'}`;
      const version = await redisClient.get(versionKey) || "1";
      const cacheKey = `announcements:${userId}:${role}:scope:${cacheScope}:q:${q || ''}:p:${page}:l:${limit}:v:${version}`;
      await redisClient.setEx(cacheKey, 300, JSON.stringify(responseData));
    } catch (err) {
      console.error("Redis set error:", err);
    }

    res.json(responseData);
  } catch (err) {
    console.error("Error listing announcements:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
