import express from "express";
import { getWeekMenu, setMenu, getCapacity, bookMeal, myBookings } from "../controllers/menu-controller.js";
import { verifyjwt } from "../middleware/auth.middle.js";
import { validateSetMenu, validateBookMeal } from "../validators/menu-validators.js";
import { validateuser } from "../middleware/validate.middle.js";

const router = express.Router();

router.get("/mess/menu/week", verifyjwt, getWeekMenu);
router.post("/mess/menu", verifyjwt, validateSetMenu, validateuser, setMenu);
router.get("/mess/capacity", verifyjwt, getCapacity);
router.post("/mess/book", verifyjwt, validateBookMeal, validateuser, bookMeal);
router.get("/mess/bookings/my", myBookings);

export default router;
