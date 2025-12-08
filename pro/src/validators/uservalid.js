import { body } from "express-validator";
import { Asynchandler } from "../utills/Aynchandler.js";

export const uservalid = function () {
  return [
    body("email").trim()
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email is not valid")
      .normalizeEmail(),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("username is required")
      .isLength({ min: 3 })
      .withMessage("username length is less than 3")
      .escape(),
    body("fullname")
      .optional()
      .trim()
      .escape()
  ]
}

export const loginuservalid = function () {
  return [
    body("email").trim()
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email is not valid")
      .normalizeEmail(),
    body("password").trim()
      .notEmpty()
      .withMessage("enter the password")
      .isLength({ min: 3 })
  ]
}

export const userchangecurrentpassword = Asynchandler(async (req, res) => {
  return [
    body("oldpassword").trim().withMessage("enter ths oldpassword"),
    body("newpassword").trim().withMessage("enter the newpassword")
  ]
})

export const userforgotpassword = Asynchandler(async (req, res) => {
  return [
    body("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email is invalid")
      .normalizeEmail()
  ]
})

export const userforgotresetpassword = Asynchandler(async (req, res) => {
  return [
    body("newpassword").notEmpty().withMessage("password is required")
  ]
})

export const validateStudentProfile = [
  body("course").optional().trim().notEmpty().withMessage("Course is required").escape(),
  body("year").optional().isInt({ min: 1, max: 5 }).withMessage("Year must be between 1 and 5"),
  body("contact").optional().trim().isMobilePhone().withMessage("Invalid contact number"),
  body("guardian.name").optional().trim().notEmpty().withMessage("Guardian name is required").escape(),
  body("guardian.phone").optional().trim().isMobilePhone().withMessage("Invalid guardian phone"),
  body("emergency.name").optional().trim().notEmpty().withMessage("Emergency contact name is required").escape(),
  body("emergency.phone").optional().trim().isMobilePhone().withMessage("Invalid emergency phone"),
];

export const validateMessProfile = [
  body("name").optional().trim().notEmpty().withMessage("Mess name is required").escape(),
  body("price").optional().isNumeric().withMessage("Price must be a number"),
  body("contact").optional().trim().isMobilePhone().withMessage("Invalid contact number"),
  body("location.city").optional().trim().notEmpty().withMessage("City is required").escape(),
  body("location.state").optional().trim().notEmpty().withMessage("State is required").escape(),
];

export const validateHostelProfile = [
  body("name").optional().trim().notEmpty().withMessage("Hostel name is required").escape(),
  body("price").optional().isNumeric().withMessage("Price must be a number"),
  body("contact").optional().trim().isMobilePhone().withMessage("Invalid contact number"),
];