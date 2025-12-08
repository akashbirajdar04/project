import express from "express";
import { createPoll, listPolls, votePoll } from "../controllers/poll-controller.js";
import { verifyjwt } from "../middleware/auth.middle.js";
import { validateObjectId } from "../validators/common-validators.js";
import { validateCreatePoll } from "../validators/poll-validators.js";
import { validateuser } from "../middleware/validate.middle.js";

const router = express.Router();

router.post("/polls", verifyjwt, validateCreatePoll, validateuser, createPoll);
router.get("/polls", verifyjwt, listPolls);
router.post("/polls/:id/vote", verifyjwt, validateObjectId("id"), validateuser, votePoll);

export default router;
