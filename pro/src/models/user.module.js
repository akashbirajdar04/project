import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Correct discriminatorKey setup
const userSchema = new mongoose.Schema(
  {
    avatar: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
      localpath: { type: String, default: "" },
    },
    role: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please enter the password"],
    },
    isEmailVerified: { type: Boolean, default: false },
    refreshToken: String,
    accessToken: String,
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    emailVerificationToken: String,
    isEmailVerificationExpiry: Date,
    isBanned: { type: Boolean, default: false }, // 🚫 Ban status
  },
  {
    timestamps: true,
    discriminatorKey: "role", // ✅ fix here
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password compare
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Refresh token
userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    { _id: this._id, username: this.username, email: this.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

// Access token
userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    { _id: this._id, username: this.username, email: this.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// Temporary token
userSchema.methods.temporaryAccessToken = async function () {
  const unhashedToken = crypto.randomBytes(20).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(unhashedToken)
    .digest("hex");
  const tokenExpiry = Date.now() + 60 * 1000; // 1 minute
  return { unhashedToken, hashedToken, tokenExpiry };
};

const User = mongoose.model("User", userSchema);

// ------------------ Discriminators ------------------

// Admin
const Admin = User.discriminator(
  "admin",
  new mongoose.Schema({
    // Admin specific fields if any (e.g., permissions level)
    permissions: [{ type: String }]
  })
);

// Hostel owner
const Hostel = User.discriminator(
  "hostelowner",
  new mongoose.Schema({
    name: { type: String, trim: true },
    address: { type: String, trim: true, unique: true },
    price: { type: String, trim: true },
    description: { type: String, trim: true },
    facilities: [{ type: String, trim: true }],
    images: [{ type: String, trim: true }],
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    contact: { type: String, trim: true },
    availability: { type: String, enum: ['available', 'full'], default: 'available' },
    roomTypes: [{ type: String, trim: true }],
    amenities: [{ type: String, trim: true }],
    location: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String, trim: true }
    },
    requesters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    accepted: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  })
);

// Mess owner
const Mess = User.discriminator(
  "messowner",
  new mongoose.Schema({
    name: { type: String, trim: true },
    address: { type: String, trim: true, unique: true },
    price: { type: String, trim: true },
    description: { type: String, trim: true },
    facilities: [{ type: String, trim: true }],
    menu: [{ type: String, trim: true }],
    images: [{ type: String, trim: true }],
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    contact: { type: String, trim: true },
    vegNonVeg: { type: String, enum: ['veg', 'non-veg', 'both'], default: 'both' },
    priceRange: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    location: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String, trim: true }
    },
    requesters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    accepted: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  })
);

// Student
const Student = User.discriminator(
  "student",
  new mongoose.Schema({
    course: { type: String, trim: true },
    year: { type: String, trim: true },
    preferences: {
      budget: { type: String, trim: true },
      gender: { type: String, enum: ['male', 'female', 'any'], default: 'any' },
      lifestyle: { type: String, trim: true }
    },
    messid: { type: mongoose.Schema.Types.ObjectId, ref: "User", trim: true },
    hostelid: { type: mongoose.Schema.Types.ObjectId, ref: "User", trim: true },
  })
);

export { Student, Mess, Hostel, Admin, User };
export default User;
