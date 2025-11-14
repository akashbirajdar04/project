import express from "express";
import { getStructure, upsertStructure, assignBed, swapBeds } from "../controllers/hostel-structure-controller.js";

const router = express.Router();

router.get("/hostel/:hostelId/structure", getStructure);
router.post("/hostel/:hostelId/structure", upsertStructure);
router.post("/hostel/:hostelId/assign", assignBed);
router.post("/hostel/:hostelId/swap", swapBeds);

export default router;
