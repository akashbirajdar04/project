import express from "express";
import {
  Hrequest,
  Hreq,
  hReqList,
  MReqList,
  acceptRequest,
  rejectRequest,
} from "../controllers/user-reg.js";

const router = express.Router();

router.get("/hostels", Hrequest);
router.post("/hostels/:id/request/:senderid", Hreq);
router.get("/hostels/:id/list", hReqList);
router.put("/hostels/:reqId/accept", acceptRequest);
router.put("/hostels/:reqId/reject", rejectRequest);
router.get("/mess/:id/list", MReqList);

export default router;