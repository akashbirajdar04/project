import { body } from "express-validator";

export const validateMessageList = [
    body("sender").isMongoId().withMessage("Invalid Sender ID"),
    body("receiver").isMongoId().withMessage("Invalid Receiver ID"),
];

export const validateSendMessage = [
    body("sender").isMongoId().withMessage("Invalid Sender ID"),
    body("receiver").isMongoId().withMessage("Invalid Receiver ID"),
    body("message").trim().notEmpty().withMessage("Message cannot be empty").escape(),
];
