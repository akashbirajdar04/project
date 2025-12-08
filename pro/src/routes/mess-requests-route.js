import express from "express";
import { acceptMessRequest, rejectMessRequest, getMessAccepted, removeMessAccepted, getMessMsgList, confirmMessPayment } from "../controllers/mess-requests-controller.js";
import { sendMessRequest } from "../controllers/user-reg.js";
// For dev, no auth; later add verifyjwt

import { validateObjectId, validateBodyObjectId } from "../validators/common-validators.js";
import { validateuser } from "../middleware/validate.middle.js";

const router = express.Router();

// Accept or reject a request for a specific mess (mess owner id)
router.post("/Profile/Messrequest/:messId/accept", validateObjectId("messId"), validateBodyObjectId("userId"), validateuser, acceptMessRequest);
router.post("/Profile/Messrequest/:messId/payment-success", validateObjectId("messId"), validateBodyObjectId("userId"), validateuser, confirmMessPayment);
router.post("/Profile/Messrequest/:messId/reject", validateObjectId("messId"), validateBodyObjectId("userId"), validateuser, rejectMessRequest);
router.get("/Profile/Messaccepted/:messId", validateObjectId("messId"), validateuser, getMessAccepted);
router.delete("/Profile/Messaccepted/:messId/:userId", validateObjectId("messId"), validateObjectId("userId"), validateuser, removeMessAccepted);
router.get("/Profile/Messrequest/:id/msglist", validateObjectId("id"), validateuser, getMessMsgList);

// Send mess request (Generic route must be last to avoid conflict)
router.post("/Profile/Messrequest/:id/:senderid", validateObjectId("id"), validateObjectId("senderid"), validateuser, sendMessRequest);

export default router;
