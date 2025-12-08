import { body, param } from "express-validator";

export const validateObjectId = (field) => {
    return param(field).isMongoId().withMessage(`Invalid ${field} ID format`);
};

export const validateBodyObjectId = (field) => {
    return body(field).isMongoId().withMessage(`Invalid ${field} ID format`);
};

export const validatePhone = (field) => {
    return body(field)
        .optional()
        .trim()
        .isMobilePhone()
        .withMessage(`Invalid ${field} number`);
};

export const validateRequiredString = (field, minLength = 1) => {
    return body(field)
        .trim()
        .notEmpty()
        .withMessage(`${field} is required`)
        .isLength({ min: minLength })
        .withMessage(`${field} must be at least ${minLength} characters`);
};
