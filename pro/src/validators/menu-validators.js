import { body } from "express-validator";

export const validateSetMenu = [
    body("day").isIn(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]).withMessage("Invalid day"),
    body("meals").isObject().withMessage("Meals must be an object"),
    body("meals.breakfast").optional().trim().escape(),
    body("meals.lunch").optional().trim().escape(),
    body("meals.snacks").optional().trim().escape(),
    body("meals.dinner").optional().trim().escape(),
];

export const validateBookMeal = [
    body("day").isIn(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]).withMessage("Invalid day"),
    body("mealType").isIn(["breakfast", "lunch", "snacks", "dinner"]).withMessage("Invalid meal type"),
];
