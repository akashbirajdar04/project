import express from "express";
import { validateuser } from "../middleware/validate.middle.js";
import { createOrder, verifyPayment } from "../controllers/ordercontroller.js";
import { verifyjwt } from "../middleware/auth.middle.js";

const router = express.Router();

router.post("/create-order", verifyjwt, validateuser, createOrder);
router.post("/verify-payment", verifyjwt, validateuser, verifyPayment);

export default router;
