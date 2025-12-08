import { body } from "express-validator";

export const validateLostFoundItem = [
    body("name").trim().notEmpty().withMessage("Item name is required").escape(),
    body("description").trim().notEmpty().withMessage("Description is required").escape(),
    body("location").trim().notEmpty().withMessage("Location is required").escape(),
    body("type").isIn(["Lost", "Found"]).withMessage("Invalid type (Lost/Found)"),
    body("hostelId").isMongoId().withMessage("Invalid Hostel ID"),
    // userId usually comes from req.user, but if passed in body:
    // body("userId").isMongoId().withMessage("Invalid User ID"),
];
