import { Router } from "express";
import { verifyjwt } from "../middleware/auth.middle.js";
import { getDashboardStats, getAllUsers, toggleBanUser, deleteComplaint, getAllComplaints, getPendingUpdates, approveUpdate, rejectUpdate } from "../controllers/admin-controller.js";
import { apiError } from "../utills/api-error.js";
import { validateObjectId } from "../validators/common-validators.js";
import { validateuser } from "../middleware/validate.middle.js";

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
router.patch("/users/:id/ban", validateObjectId("id"), validateuser, toggleBanUser);
router.get("/complaints", getAllComplaints);
router.delete("/complaints/:id", validateObjectId("id"), validateuser, deleteComplaint);

// Profile Updates
router.get("/updates/pending", getPendingUpdates);
router.patch("/updates/:id/approve", validateObjectId("id"), validateuser, approveUpdate);
router.patch("/updates/:id/reject", validateObjectId("id"), validateuser, rejectUpdate);

export default router;
