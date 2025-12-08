import express from "express";
import { getStructure, upsertStructure, assignBed, swapBeds } from "../controllers/hostel-structure-controller.js";
import { validateStructure, validateAssignBed, validateSwapBeds } from "../validators/hostel-structure-validators.js";
import { validateObjectId } from "../validators/common-validators.js";
import { validateuser } from "../middleware/validate.middle.js";

const router = express.Router();

router.get("/hostel/:hostelId/structure", validateObjectId("hostelId"), validateuser, getStructure);
router.post("/hostel/:hostelId/structure", validateObjectId("hostelId"), validateStructure, validateuser, upsertStructure);
router.post("/hostel/:hostelId/assign", validateObjectId("hostelId"), validateAssignBed, validateuser, assignBed);
router.post("/hostel/:hostelId/swap", validateObjectId("hostelId"), validateSwapBeds, validateuser, swapBeds);

export default router;
