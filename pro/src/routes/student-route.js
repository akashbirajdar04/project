import express from "express";
import { getProfile, updateProfile, getEnrolledMess, getLookingStudents } from "../controllers/student-controller.js";
// import { verifyjwt } from "../middleware/auth.middle.js";

import { upload } from "../middleware/multer.middleware.js";

import { validateStudentProfile } from "../validators/uservalid.js";
import { validateuser } from "../middleware/validate.middle.js";

const router = express.Router();

router.get("/student/profile", getProfile);
router.post("/student/profile", upload.single("avatar"), validateStudentProfile, validateuser, updateProfile);
router.get("/student/looking", getLookingStudents);
router.get("/student/:userId/mess", getEnrolledMess);

export default router;
