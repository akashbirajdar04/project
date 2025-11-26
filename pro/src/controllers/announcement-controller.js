import { Announcement } from "../models/announcement.js";
import { Student } from "../models/user.module.js";

export const createAnnouncement = async (req, res) => {
  try {
    const { title, body, scope: requestedScope, tags = [] } = req.body;
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
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const listAnnouncements = async (req, res) => {
  try {
    console.log("Listing announcements for user:", req.user?._id, "Role:", req.user?.role);
    const { scope, q } = req.query;

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

    console.log("Announcement Filter:", JSON.stringify(filter));
    const docs = await Announcement.find(filter)
      .populate("createdBy", "name email username")
      .sort({ createdAt: -1 })
      .limit(200);

    // Map createdBy to postedBy for frontend compatibility
    const mappedDocs = docs.map(d => {
      const obj = d.toObject();
      return { ...obj, postedBy: obj.createdBy };
    });

    res.json({ success: true, data: mappedDocs });
  } catch (err) {
    console.error("Error listing announcements:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
