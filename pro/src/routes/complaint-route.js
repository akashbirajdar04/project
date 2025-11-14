import express from "express";
import { createTicket, myTickets, updateStatus, addFeedback } from "../controllers/complaint-controller.js";

const router = express.Router();

router.post("/tickets", createTicket);
router.get("/tickets/my", myTickets);
router.patch("/tickets/:id/status", updateStatus);
router.post("/tickets/:id/feedback", addFeedback);

export default router;
