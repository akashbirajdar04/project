import express from "express";
import { createTicket, myTickets, updateStatus, addFeedback } from "../controllers/complaint-controller.js";

const router = express.Router();

router.post("/complaints", createTicket);
router.get("/complaints/my", myTickets);
router.patch("/complaints/:id/status", updateStatus);
router.post("/complaints/:id/feedback", addFeedback);

export default router;
