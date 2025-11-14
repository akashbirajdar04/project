import express from "express";
import { getProfile, updateProfile, getEnrolledMess } from "../controllers/student-controller.js";
// import { verifyjwt } from "../middleware/auth.middle.js";

const router = express.Router();

router.get("/student/profile", getProfile);
router.post("/student/profile", updateProfile);
router.get("/student/:userId/mess", getEnrolledMess);

export default router;
