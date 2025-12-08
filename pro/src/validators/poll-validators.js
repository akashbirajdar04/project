import { body } from "express-validator";

export const validateCreatePoll = [
    body("question")
        .trim()
        .notEmpty()
        .withMessage("Question is required")
        .isLength({ min: 5, max: 200 })
        .withMessage("Question must be between 5 and 200 characters")
        .escape(),

    body("options")
        .isArray({ min: 2 })
        .withMessage("At least 2 options are required")
        .custom((options) => {
            if (!options.every(opt => typeof opt === 'string' && opt.trim().length > 0)) {
                throw new Error("All options must be non-empty strings");
            }
            return true;
        }),

    body("options.*")
        .trim()
        .escape(),

    body("scope")
        .optional()
        .isIn(["global", "mess", "hostel"])
        .withMessage("Invalid scope"),

    body("expiresAt")
        .optional()
        .isISO8601()
        .withMessage("Invalid date format")
        .custom((value) => {
            if (new Date(value) <= new Date()) {
                throw new Error("Expiration date must be in the future");
            }
            return true;
        })
];
