import { validationResult } from "express-validator";

export const validateuser = (req, res, next) => {


  const errors = validationResult(req);

  if (errors.isEmpty()) return next(); // validation passed, continue

  // Format the errors
  const extractedErrors = errors.array().map(err => ({
    [err.path]: err.msg
  }));

  // Send error response immediately
  return res.status(400).json({
    success: false,
    message: "Received data is not valid",
    errors: extractedErrors
  });
};

