import express from "express";
import { acceptMessRequest, rejectMessRequest, getMessAccepted, removeMessAccepted } from "../controllers/mess-requests-controller.js";
// For dev, no auth; later add verifyjwt

const router = express.Router();

// Accept or reject a request for a specific mess (mess owner id)
router.post("/Profile/Messrequest/:messId/accept", acceptMessRequest);
router.post("/Profile/Messrequest/:messId/reject", rejectMessRequest);
router.get("/Profile/Messaccepted/:messId", getMessAccepted);
router.delete("/Profile/Messaccepted/:messId/:userId", removeMessAccepted);

export default router;
