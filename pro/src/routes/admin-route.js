import { Router } from "express";
import { verifyjwt } from "../middleware/auth.middle.js";
import { getDashboardStats, getAllUsers, toggleBanUser, deleteComplaint, getAllComplaints, getPendingUpdates, approveUpdate, rejectUpdate } from "../controllers/admin-controller.js";
import { apiError } from "../utills/api-error.js";

const router = Router();

// Middleware to verify Admin role
const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        next(new apiError(403, "Access denied. Admins only."));
    }
};

router.use(verifyjwt);
router.use(verifyAdmin);

router.get("/stats", getDashboardStats);
router.get("/users", getAllUsers);
router.patch("/users/:id/ban", toggleBanUser);
router.get("/complaints", getAllComplaints);
router.delete("/complaints/:id", deleteComplaint);

// Profile Updates
router.get("/updates/pending", getPendingUpdates);
router.patch("/updates/:id/approve", approveUpdate);
router.patch("/updates/:id/reject", rejectUpdate);

export default router;
