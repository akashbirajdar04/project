import express from "express";
import { createAnnouncement, listAnnouncements } from "../controllers/announcement-controller.js";
import { verifyjwt } from "../middleware/auth.middle.js";

const router = express.Router();

router.get("/announcements", verifyjwt, listAnnouncements);
router.post("/announcements", verifyjwt, createAnnouncement);

export default router;
