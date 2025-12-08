import { body } from "express-validator";

export const validateRequestCreation = [
    body("toOwner").isMongoId().withMessage("Invalid Owner ID"),
    // fromUser is usually taken from req.user, but if passed in body:
    // body("fromUser").isMongoId().withMessage("Invalid User ID"),
];

export const validateRoommateRequest = [
    body("preferences").trim().notEmpty().withMessage("Preferences are required"),
    body("gender").optional().isIn(["Male", "Female", "Any"]).withMessage("Invalid gender preference"),
    body("contactInfo").trim().notEmpty().withMessage("Contact info is required"),
];

export const validateComplaint = [
    body("category").isIn(["room", "plumbing", "electricity", "housekeeping", "food", "other"]).withMessage("Invalid category"),
    body("description").trim().notEmpty().withMessage("Description is required").isLength({ min: 10 }).withMessage("Description must be at least 10 characters").escape(),
];

export const validateStatusUpdate = [
    body("status").isIn(["open", "in-progress", "resolved", "closed"]).withMessage("Invalid status"),
];

export const validateFeedback = [
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
    body("comment").optional().trim().escape(),
];

export const validateMealFeedbackSubmission = [
    body("messId").isMongoId().withMessage("Invalid Mess ID"),
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
    body("comment").optional().trim().escape(),
];
