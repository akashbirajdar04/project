import { healthchecker } from "../controllers/healthchecker-controller.js";
import { Router } from "express";

const router=Router()

router.route('/').get(healthchecker)
export default router;