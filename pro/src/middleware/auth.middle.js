import { version } from "mongoose";
import User from "../models/user.module.js";
import { apiError } from "../utills/api-error.js";
import { Asynchandler } from "../utills/Aynchandler.js";
import jwt from "jsonwebtoken";

export const verifyjwt = Asynchandler(async (req, res, next) => {
  // Get token from cookies or header
  const token =
    req.cookies?.accesstoken ||
    req.header("Authorization")?.replace("Bearer", "").trim();
  console.log(token)
  if (!token) {
    throw new apiError(401, "Access token not found");
  }

  // Verify token
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Get user from DB
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new apiError(404, "User not found");
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      throw new apiError(401, "Invalid or expired token");
    }
    throw error;
  }
});
