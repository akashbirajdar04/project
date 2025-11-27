import { Asynchandler } from "../utills/Aynchandler.js";
import User from "../models/user.module.js";
import { sendEmail } from "../utills/mail.js";
import { mailverificationmailgencontent, resetpasswordmailgencontent } from "../utills/email-con.js";
import { ApiResponse } from "../utills/api-response.js";
import { apiError } from "../utills/api-error.js";
import { param } from "express-validator";
import crypto, { hash } from "crypto";
import { Hostel } from "../models/hostel.js";
import { Mess } from "../models/mess.module.js";
import jwt from "jsonwebtoken";
import { Request } from "../models/req.js";

import { Student } from "../models/user.module.js";

// Generate access + refresh tokens
const accessAndRefreshToken = async (user) => {
  const refreshToken = await user.generateRefreshToken();
  const accessToken = await user.generateAccessToken();
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

// ========================= User Registration =========================
export const userRegistration = Asynchandler(async (req, res, next) => {
  const { username, password, email, role } = req.body;
  console.log(role)
  // Check if user already exists

  const ifExist = await User.findOne({ $or: [{ username }, { email }] });
  if (ifExist) {
    return res.json("this user is presents")
  }
  console.log("hello")
  let user
  // Create new user
  if (role == "student") {
    user = await Student.create({
      email: email.trim().toLowerCase(),
      role: role.trim().toLowerCase(),
      username: username.trim(),
      password,
      isEmailVerified: false
    });
  }
  else if (role == "messowner") {
    user = await Mess.create({
      email: email.trim().toLowerCase(),
      role: role.trim().toLowerCase(),
      username: username.trim(),
      password,
      isEmailVerified: false
    })
  }
  else {
    user = await Hostel.create({
      email: email.trim().toLowerCase(),
      role: role.trim().toLowerCase(),
      username: username.trim(),
      password,
      isEmailVerified: false
    })
  }
  if (!user) console.log("User is not created")
  else { console.log("it is created") }
  // Generate temporary token
  const { unhashedToken, hashedToken, tokenExpiry } =
    await user.temporaryAccessToken();

  // Save token info
  user.emailVerificationToken = hashedToken;
  user.isEmailVerificationExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });

  // Send verification email
  await sendEmail({
    email: user.email,
    subject: "Please verify your email",
    mailgencontent: mailverificationmailgencontent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-emails/${unhashedToken}`
    )
  });

  return res.status(201).json(
    new ApiResponse(201, "User registered successfully. Verification email sent.", {
      userId: user._id
    })
  );
});

// ========================= User Login =========================
// ========================= User Login =========================
export const UserLogin = Asynchandler(async (req, res, next) => {
  const { email, password } = req.body;
  console.log("Login Attempt:", email);

  // Step 1️⃣ Find user by email (any role)
  const baseUser = await User.findOne({ email });
  if (!baseUser) throw new apiError(404, "Please register first");

  // Step 2️⃣ Identify correct model based on role
  let user;
  switch (baseUser.role) {
    case "student":
      user = await Student.findById(baseUser._id);
      break;
    case "messowner":
      user = await Mess.findById(baseUser._id);
      break;
    case "hostelowner":
      user = await Hostel.findById(baseUser._id);
      break;
    default:
      throw new apiError(400, "Invalid role type");
  }

  if (!user) throw new apiError(404, "User not found in specific role model");

  // Step 3️⃣ Verify password
  const isCorrect = await user.isPasswordCorrect(password);
  if (!isCorrect) throw new apiError(401, "Invalid credentials");

  // Step 4️⃣ Generate tokens
  const { accessToken, refreshToken } = await accessAndRefreshToken(user);

  // Step 5️⃣ Send response
  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .cookie("accesstoken", accessToken, options)
    .cookie("refreshtoken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          userId: user._id,
          accessToken,
          refreshToken,
          role: user.role,
        },
        "Login successful"
      )
    );
});

export const logout = Asynchandler(async (req, res, next) => {
  // Clear refresh token from DB
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: "" }
    },
    { new: true } // return updated user
  );

  if (!user) {
    throw new apiError(404, "User not found while logging out");
  }

  // Cookie options
  const option = {
    httpOnly: true,
    secure: true, // set to true in production with HTTPS
    sameSite: "strict"
  };

  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json({
      success: true,
      message: "User logged out successfully"
    });
});

export const getcurrentuser = Asynchandler((req, res, next) => {
  const user = req.user;
  return new ApiResponse(200, { user }, "user info is fetched successfully")
})

export const verifyEmail = Asynchandler(async (req, res, next) => {
  const { Token } = req.params

  if (!Token) throw new apiError(404, "token is not there")
  const hashToken = crypto.createHash("sha256")
    .update(Token)
    .digest("hex")
  if (!hashToken) throw new apiError(404, "hashtoken is not there")

  const user = await User.findOne({
    emailVerificationToken: hashToken,
    isEmailVerificationExpiry: { $gt: Date.now() }
  })
  if (!user) throw new apiError(404, "user is not there")
  user.emailVerificationToken = undefined
  user.isEmailVerificationExpiry = undefined
  user.isEmailVerified = true;
  await user.save({ validateBeforeSave: false })
  return new ApiResponse(200, {}, "Email is verified")
});

export const resendemail = Asynchandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user) {
    throw new apiError("404", "cant find the user")
  }
  if (user.isEmailVerified) {
    return new ApiResponse(202, {}, "Email is verified")
  }
  const { unhashedToken, hashedToken, tokenExpiry } =
    await user.temporaryAccessToken();
  user.emailVerificationToken = hashedToken;
  user.isEmailVerificationExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });

  // Send verification email
  await sendEmail({
    email: user.email,
    subject: "Please verify your email",
    mailgencontent: mailverificationmailgencontent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-emails/${unhashedToken}`
    )
  });
  return res.json(202, (new ApiResponse(202, {}, "Email is succesfully resend")))
})

const refreshaccessToken = Asynchandler(async (req, res) => {
  const Token = req.cookie.refreshToken || req.user.refreshToken
  if (!Token) throw new apiError("404", "tokn is invalid")
  const Dtoken = jwt.verify(Token, process.env.REFRESH_TOKEN_SECRET)
  if (!Dtoken) throw new apiError(404, "tkon is invalid")
  const user = User.findOne(Dtoken._id)
  if (!user) throw new apiError("404", "token is invalid")
  const { acessToken, refreshToken: newrefreshToken } = acsessandrefreshtoken(user)
  user.accessToken = acessToken
  user.refreshToken = newrefreshToken
  user.save({ validation: false })

  return new ApiResponse(202, {}, "new refresh token and acess token are created")
})
const forgotPassword = Asynchandler(async (req, res) => {
  const { email } = req.body
  const user = User.findOne({ email })
  if (!user) throw new apiError("404", "user is  invalid")
  const { unhashedToken, hashToken, tokenExpiry } = User.temporaryAccessToken()
  user.forgotPassword = hashToken
  user.forgotPasswordExpiry = tokenExpiry
  await sendEmail({
    email: user.email,
    subject: "forgot password",
    mailgencontent: resetpasswordmailgencontent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-emails/${unhashedToken}`
    )
  });
  return new ApiResponse(202, {}, "reset password is send successfully")
})

export const resetpassword = Asynchandler(async (req, res) => {
  const Token = req.param
  const { newpassword } = req.body

  let hasToken = crypto.createHash("sha256")
    .update(Token).digest("hex")

  const user = User.findOne({
    forgotPassword: hasToken,
    forgotPasswordExpiry: { $gt: Date.now() }
  })
  if (!user) throw new apiError("404", "user is  invalid")
  user.forgotPassword = undefined
  user.forgotPasswordExpiry = undefined
  user.password = newpassword
  user.save({ validation: true })

  return new ApiResponse(202, {}, "password is reset successfully")
})
export const updatepass = Asynchandler(async (req, res) => {

  const { oldpassword, newpassword } = req.body
  const user = User.findOne(req.user?._id)
  if (!user) throw new apiError("404", "user is  invalid")
  const isvalid = User.isPasswordCorrect(newpassword)
  if (!isvalid) throw new apiError(404, "password is invalid")
  user.password = newpassword
  user.save({ validation: false })
})


// Mess

export const Mprofile = async (req, res) => {
  try {
    const { id, name, adress, price, description, facilities, contact, vegNonVeg, priceRange, location } = req.body;
    if (!id) return res.status(400).json({ message: "id is required" });

    const mess = await Mess.findById(id);
    if (!mess) throw new apiError(404, "Mess not found");

    if (name !== undefined) mess.name = name;
    if (adress !== undefined) mess.adress = adress;
    if (price !== undefined) mess.price = price;
    if (description !== undefined) mess.description = description;
    if (Array.isArray(facilities)) mess.facilities = facilities;
    if (contact !== undefined) mess.contact = contact;
    if (vegNonVeg !== undefined) mess.vegNonVeg = vegNonVeg;
    if (priceRange !== undefined) mess.priceRange = priceRange;
    if (location && typeof location === 'object') {
      mess.location = {
        city: location.city ?? mess.location?.city,
        state: location.state ?? mess.location?.state,
        pincode: location.pincode ?? mess.location?.pincode,
      };
    }

    await mess.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, mess, "Mess profile updated"));
  } catch (e) {
    console.error("Error saving mess profile:", e.message);
    return res.status(500).json(new ApiResponse(500, {}, "Error saving mess profile"));
  }
};

export const getMessProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const mess = await Mess.findById(id);
    if (!mess) throw new apiError(404, "Mess not found");
    return res.status(200).json(new ApiResponse(200, mess, "Mess profile fetched"));
  } catch (e) {
    return res.status(e.statusCode || 500).json({ message: e.message || "Internal server error" });
  }
};
export const Hprofile = async (req, res, next) => {
  const { name, adress, price, id } = req.body;

  try {


    const hostel = await Hostel.findById(id);
    if (!hostel) throw new apiError(404, "Hostel not found");

    hostel.name = name;
    hostel.adress = adress;
    hostel.price = price;
    await hostel.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, hostel, "Data updated"));

  } catch (error) {
    console.error("Error saving hostel profile:", error.message);
    res.status(500).json(new ApiResponse(500, {}, "Error saving hostel profile"));
  }
};



export const Hrequest = async (req, res) => {
  try {
    console.log("hi");
    const hostels = await Hostel.find();

    if (!hostels) {
      throw new apiError(404, "No hostels found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, hostels, "Data fetched successfully"));
  } catch (err) {
    console.error(err);
    return res.status(err.statusCode || 500).json({
      message: err.message || "Internal server error",
    });
  }
};

export const Hreq = async (req, res) => {
  try {
    const { id, senderid } = req.params; // id = requester, senderid = hostel owner
    console.log(senderid)
    // Find the hostel owned by senderid
    const hostel = await Hostel.findById({ _id: id });

    if (!hostel) {
      throw new apiError(404, "Hostel not found for this owner");
    }

    // Check if user already requested
    if (hostel.requesters.includes(senderid)) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "User already sent a request"));
    }

    // Check if user is already enrolled (accepted)
    if (hostel.accepted && hostel.accepted.includes(senderid)) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "You are already enrolled in this hostel"));
    }

    // Add to requesters array
    hostel.requesters.push(senderid);
    await hostel.save();

    // Create request document for tracking
    const newRequest = await Request.create({
      fromUser: senderid,
      toOwner: id,
    });

    if (!newRequest) {
      throw new apiError(400, "Cannot send request");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, newRequest, "Request sent successfully"));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error sending request", error: error.message });
  }
};


export const MReqList = async (req, res) => {
  const { id } = req.params
  const user = await Mess.findById(id)
  if (!user) throw new apiError(400, "Cannot send request");
  return res.status(200)
    .json(new ApiResponse(200, user.requesters, "succesufuly fetched data"))
}

export const hReqList = async (req, res) => {
  const { id } = req.params
  const user = await Hostel.findById(id)
  if (!user) {
    console.log("hey")
    throw new apiError(400, "Cannot send request");
  }
  console.log(id)
  console.log(user)
  return res.status(200)
    .json(new ApiResponse(200, user.requesters, "succesufuly fetched data"))
}
import { sendNotification } from "../utills/notification-helper.js";

export const acceptRequest = async (req, res) => {
  try {
    const { reqId } = req.params; // <-- this is request ID (not owner)
    console.log(`this is ${reqId}`)
    // 1️⃣ Find the request by its ID
    const request = await Request.findOne({ toOwner: reqId });


    if (!request)
      return res.status(404).json({ message: "Request not found" });

    // 2️⃣ Update request status
    request.status = "accepted";
    await request.save();

    // 3️⃣ Find the hostel owner and update their accepted list
    const hostel = await Hostel.findById(reqId);
    if (!hostel)
      return res.status(404).json({ message: "Hostel not found for this request" });
    console.log(`this is:${hostel}`)
    // 4️⃣ Remove user from requesters (if exists)
    hostel.requesters = hostel.requesters.filter(
      (userId) => userId.toString() !== request.fromUser.toString()
    );
    console.log("hi")
    // 5️⃣ Add user to accepted list (avoid duplicates)
    hostel.accepted.addToSet(request.fromUser);
    await hostel.save();
    console.log("heyyy")
    const user = await Student.findOne({ _id: request.fromUser })
    if (!user)
      return res.status(404).json({ message: "user not found for this request" });
    user.hostelid = request.toOwner
    await user.save()
    console.log("hey")

    // 🔔 Send Notification
    await sendNotification(req, request.fromUser, "success", `Your request to join ${hostel.name || 'the hostel'} has been accepted!`, reqId, "Hostel");

    // 6️⃣ Respond
    return res.status(200).json({
      message: "Request accepted successfully",
      data: request,
    });
  } catch (error) {
    console.error("Error accepting request:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


export const rejectRequest = async (req, res) => {
  try {
    const { reqId } = req.params;
    // 1️⃣ Find the request before deleting (so we know which hostel & user)
    // Fix: findOne({ toOwner: reqId }) matches acceptRequest logic, assuming reqId is Owner ID
    const request = await Request.findOne({ toOwner: reqId });
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // 2️⃣ Remove the user from hostel.requesters array (if exists)
    // Fix: findById(reqId) instead of findByOne({}) which is invalid
    const hostel = await Hostel.findById(reqId);
    if (hostel) {
      hostel.requesters = hostel.requesters.filter(
        (userId) => userId.toString() !== request.fromUser.toString()
      );
      await hostel.save();
    }

    // 🔔 Send Notification
    await sendNotification(req, request.fromUser, "error", `Your request to join ${hostel?.name || 'the hostel'} has been rejected.`, reqId, "Hostel");

    // 3️⃣ Delete the request document
    await Request.findByIdAndDelete(request._id);

    // 4️⃣ Respond
    res.status(200).json({ message: "Request rejected and removed successfully" });
  } catch (error) {
    console.error("Error rejecting request:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const acceptedlist = async (req, res) => {
  const { id } = req.params
  const request = await Request.find({ fromUser: id, status: "accepted" })
  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }
  console.log(request)
  return res.json(new ApiResponse(200, request, "list fetched succesfully"))
}

export const msglist = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.query; // get ?name= from frontend

    // Find the hostel and populate accepted users
    const hostel = await Hostel.findById(id).populate("accepted");

    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    let acceptedUsers = hostel.accepted;

    // 🔍 If user searched for a name, filter accepted users
    if (name && name.trim() !== "") {
      const regex = new RegExp(name, "i"); // case-insensitive
      acceptedUsers = acceptedUsers.filter(user => regex.test(user.name));
    }

    return res.status(200).json(acceptedUsers);
  } catch (error) {
    console.error("Error fetching message list:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};


export const gethosteid = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.query;

    const student = await Student.findById(id).populate("hostelid").lean();

    if (!student) {
      // Return empty array instead of 404 for non-students
      return res.status(200).json(new ApiResponse(200, [], "No hostel data found"));
    }

    let hostelData = student.hostelid;

    // If the student has multiple hostels
    if (Array.isArray(hostelData)) {
      if (name && name.trim() !== "") {
        const regex = new RegExp(name, "i");
        hostelData = hostelData.filter((h) => h && regex.test(h.name));
      }
    } else if (hostelData) {
      // If student has only one hostel
      if (name && name.trim() !== "") {
        const regex = new RegExp(name, "i");
        hostelData = regex.test(hostelData.name) ? [hostelData] : [];
      } else {
        hostelData = [hostelData];
      }
    } else {
      hostelData = [];
    }

    return res.status(200).json(new ApiResponse(200, hostelData, "Hostel data fetched successfully"));
  } catch (error) {
    console.error("Error fetching student hostel ID:", error);
    return res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
};


import { Message, Chat } from "../models/chat.js";

// 📩 Get all messages between two users
export const getAllMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({
        success: false,
        message: "Sender and Receiver IDs are required",
      });
    }

    // 🔍 Find the chat that includes both participants
    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!chat) {
      // No chat exists yet
      return res.status(200).json({
        success: true,
        data: [],
        message: "No messages yet",
      });
    }

    // 💬 Get all messages from this chat
    const messages = await Message.find({ chatId: chat._id })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: 1 }); // sort oldest → newest

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get hostel profile
export const getHostelProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const hostel = await Hostel.findById(id).select('-password -refreshToken -accessToken -emailVerificationToken');
    if (!hostel) {
      return res.status(404).json(new ApiResponse(404, null, "Hostel not found"));
    }
    return res.status(200).json(new ApiResponse(200, hostel, "Hostel profile fetched successfully"));
  } catch (error) {
    console.error("Error fetching hostel profile:", error);
    return res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
};

// Update hostel profile
export const updateHostelProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const hostel = await Hostel.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true }).select('-password -refreshToken -accessToken -emailVerificationToken');
    if (!hostel) {
      return res.status(404).json(new ApiResponse(404, null, "Hostel not found"));
    }
    return res.status(200).json(new ApiResponse(200, hostel, "Hostel profile updated successfully"));
  } catch (error) {
    console.error("Error updating hostel profile:", error);
    return res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
};

// Get student's enrolled hostel
// Get all messes
export const getMessList = async (req, res) => {
  try {
    const messes = await Mess.find().select('-password -refreshToken -accessToken -emailVerificationToken');
    return res.status(200).json(new ApiResponse(200, messes, "Messes fetched successfully"));
  } catch (error) {
    console.error("Error fetching mess list:", error);
    return res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
};

// Get all hostels
export const getHostelList = async (req, res) => {
  try {
    const hostels = await Hostel.find().select('-password -refreshToken -accessToken -emailVerificationToken');
    return res.status(200).json(new ApiResponse(200, hostels, "Hostels fetched successfully"));
  } catch (error) {
    console.error("Error fetching hostel list:", error);
    return res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
};

// Send mess request
export const sendMessRequest = async (req, res) => {
  try {
    const { id, senderid } = req.params;
    const mess = await Mess.findById(id);
    if (!mess) {
      return res.status(404).json(new ApiResponse(404, null, "Mess not found"));
    }
    const alreadyRequested = mess.requesters.some(r => r.toString() === senderid);
    if (alreadyRequested) {
      return res.status(400).json(new ApiResponse(400, null, "User already sent a request"));
    }

    // Check if user is already enrolled (accepted)
    if (mess.accepted && mess.accepted.some(r => r.toString() === senderid)) {
      return res.status(400).json(new ApiResponse(400, null, "You are already enrolled in this mess"));
    }

    mess.requesters.addToSet(senderid);
    await mess.save();
    const newRequest = await Request.create({ fromUser: senderid, toOwner: id });
    return res.status(200).json(new ApiResponse(200, newRequest, "Request sent successfully"));
  } catch (error) {
    console.error("Error sending mess request:", error);
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};
