import { body } from "express-validator";

export const validateAnnouncement = [
    body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 100 }).withMessage("Title too long").escape(),
    body("body").trim().notEmpty().withMessage("Body is required").escape(),
    body("scope").optional().isIn(["global", "mess", "hostel"]).withMessage("Invalid scope"),
    body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Invalid priority"),
];
