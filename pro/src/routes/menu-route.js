import express from "express";
import { getWeekMenu, setMenu, getCapacity, bookMeal, myBookings } from "../controllers/menu-controller.js";
// import { verifyjwt } from "../middleware/auth.middle.js";

const router = express.Router();

router.get("/mess/menu/week", getWeekMenu);
router.post("/mess/menu", setMenu); // TODO: protect with verifyjwt for manager
router.get("/mess/capacity", getCapacity);
router.post("/mess/book", bookMeal); // accepts userId in body for dev
router.get("/mess/bookings/my", myBookings);

export default router;
