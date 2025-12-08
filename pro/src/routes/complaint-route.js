import express from "express";
import { createTicket, myTickets, updateStatus, addFeedback } from "../controllers/complaint-controller.js";

import { validateComplaint, validateStatusUpdate, validateFeedback } from "../validators/request-validators.js";
import { validateObjectId } from "../validators/common-validators.js";
import { validateuser } from "../middleware/validate.middle.js";

const router = express.Router();

router.post("/complaints", validateComplaint, validateuser, createTicket);
router.get("/complaints/my", myTickets);
router.patch("/complaints/:id/status", validateObjectId("id"), validateStatusUpdate, validateuser, updateStatus);
router.post("/complaints/:id/feedback", validateObjectId("id"), validateFeedback, validateuser, addFeedback);

export default router;
