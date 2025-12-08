import express from "express";
import { createAnnouncement, listAnnouncements } from "../controllers/announcement-controller.js";
import { verifyjwt } from "../middleware/auth.middle.js";
import { validateAnnouncement } from "../validators/announcement-validators.js";
import { validateuser } from "../middleware/validate.middle.js";

const router = express.Router();

router.get("/announcements", verifyjwt, listAnnouncements);
router.post("/announcements", verifyjwt, validateAnnouncement, validateuser, createAnnouncement);

export default router;
