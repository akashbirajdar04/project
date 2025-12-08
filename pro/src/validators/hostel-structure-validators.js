import { body } from "express-validator";

export const validateStructure = [
    body("floors").isArray({ min: 1 }).withMessage("Floors must be a non-empty array"),
    body("floors.*.floorNumber").isInt({ min: 0 }).withMessage("Invalid floor number"),
    body("floors.*.rooms").isArray({ min: 1 }).withMessage("Rooms must be a non-empty array"),
    body("floors.*.rooms.*.roomNumber").trim().notEmpty().withMessage("Room number is required").escape(),
    body("floors.*.rooms.*.capacity").isInt({ min: 1 }).withMessage("Capacity must be at least 1"),
];

export const validateAssignBed = [
    body("floorNumber").isInt({ min: 0 }).withMessage("Invalid floor number"),
    body("roomNumber").trim().notEmpty().withMessage("Room number is required").escape(),
    body("bedNumber").isInt({ min: 1 }).withMessage("Invalid bed number"),
    body("userId").isMongoId().withMessage("Invalid User ID"),
];

export const validateSwapBeds = [
    body("student1Id").isMongoId().withMessage("Invalid Student 1 ID"),
    body("student2Id").isMongoId().withMessage("Invalid Student 2 ID"),
];
