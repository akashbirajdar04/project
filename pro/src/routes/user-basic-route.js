import express from "express";
import { getUsersBasic } from "../controllers/user-basic-controller.js";

const router = express.Router();

router.get("/users/basic", getUsersBasic);

export default router;
