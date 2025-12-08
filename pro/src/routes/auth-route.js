import express from "express";
import { uservalid, loginuservalid, validateMessProfile, validateHostelProfile } from "../validators/uservalid.js";
import { validateuser } from "../middleware/validate.middle.js";
import { userRegistration, UserLogin, logout, resendemail } from "../controllers/user-reg.js";
import { verifyjwt } from "../middleware/auth.middle.js";
import { Hprofile, getHostelProfile, updateHostelProfile } from "../controllers/user-reg.js";
import { Mprofile, getMessProfile, getMessList } from "../controllers/user-reg.js";
import { Hrequest, Hreq, hReqList, acceptRequest, rejectRequest, msglist, getHostelList, confirmHostelPayment } from "../controllers/user-reg.js";
import { acceptedlist, gethosteid } from "../controllers/user-reg.js";
import { getAllMessages, MReqList, markMessagesAsRead, getUnreadChattersCount } from "../controllers/user-reg.js";
import { validateObjectId, validateBodyObjectId } from "../validators/common-validators.js";
import { validateMessageList } from "../validators/message-validators.js";

const AuthRoute = express.Router();

// Register/Login
AuthRoute.post("/register", uservalid(), validateuser, userRegistration);
AuthRoute.post("/login", loginuservalid(), validateuser, UserLogin);
AuthRoute.post("/logout", verifyjwt, logout);
AuthRoute.post("/resendemail", verifyjwt, resendemail);

// Mess Profile
AuthRoute.post("/Profile/Messprofile", validateMessProfile, validateuser, Mprofile);
AuthRoute.get("/Profile/Messprofile/:id", validateObjectId("id"), validateuser, getMessProfile);
AuthRoute.get("/Profile/messList", getMessList);

// Mess Request (List only, send/accept moved to mess-requests-route.js)
AuthRoute.get("/Profile/Messrequest/:id", validateObjectId("id"), validateuser, MReqList);

// Hostel routes
AuthRoute.post("/Profile/Hostelprofile", validateHostelProfile, validateuser, Hprofile);
AuthRoute.get("/hostel/:id/profile", validateObjectId("id"), validateuser, getHostelProfile);
AuthRoute.put("/hostel/:id/profile", validateObjectId("id"), validateHostelProfile, validateuser, updateHostelProfile);
AuthRoute.get("/Profile/Hostelrequest", Hrequest);
AuthRoute.post("/Profile/Hostelrequest/:id/:senderid", validateObjectId("id"), validateObjectId("senderid"), validateuser, Hreq);
AuthRoute.get("/Profile/Hostelrequest/:id", validateObjectId("id"), validateuser, hReqList);
AuthRoute.put("/Profile/Hostelrequest/:hostelId/payment-success", validateObjectId("hostelId"), validateBodyObjectId("userId"), validateuser, confirmHostelPayment);
AuthRoute.put("/Profile/Hostelrequest/:reqId/accept", validateObjectId("reqId"), validateuser, acceptRequest);
AuthRoute.put("/Profile/Hostelrequest/:reqId/reject", validateObjectId("reqId"), validateuser, rejectRequest);
AuthRoute.get("/Profile/Hostelrequest/:id/msglist", validateObjectId("id"), validateuser, msglist);
AuthRoute.get("/Profile/hostelList", getHostelList);

// Student routes
AuthRoute.get("/Profile/Accepted-list/:id", validateObjectId("id"), validateuser, acceptedlist);
AuthRoute.get("/Profile/student/:id/hostel", validateObjectId("id"), validateuser, gethosteid);

// Message routes
AuthRoute.post("/Profile/messages/getAll", validateMessageList, validateuser, getAllMessages);
AuthRoute.post("/Profile/messages/markRead", validateuser, markMessagesAsRead);
AuthRoute.get("/Profile/messages/unread-count", verifyjwt, validateuser, getUnreadChattersCount);

export default AuthRoute;
