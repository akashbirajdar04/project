import express from "express";
import { uservalid, loginuservalid } from "../validators/uservalid.js";
import { validateuser } from "../middleware/validate.middle.js";
import { userRegistration, UserLogin, logout, resendemail } from "../controllers/user-reg.js";
import { verifyjwt } from "../middleware/auth.middle.js";
import { Hprofile, getHostelProfile, updateHostelProfile } from "../controllers/user-reg.js";
import { Mprofile, getMessProfile, getMessList } from "../controllers/user-reg.js";
import { Hrequest, Hreq, hReqList, acceptRequest, rejectRequest, msglist, getHostelList } from "../controllers/user-reg.js";
import { acceptedlist, gethosteid } from "../controllers/user-reg.js";
import { getAllMessages, MReqList } from "../controllers/user-reg.js";

const AuthRoute = express.Router();

// Register/Login
AuthRoute.post("/register", uservalid(), validateuser, userRegistration);
AuthRoute.post("/login", UserLogin);
AuthRoute.post("/logout", verifyjwt, logout);
AuthRoute.post("/resendemail", verifyjwt, resendemail);

// Mess Profile
AuthRoute.post("/Profile/Messprofile", Mprofile);
AuthRoute.get("/Profile/Messprofile/:id", getMessProfile);
AuthRoute.get("/Profile/messList", getMessList);

// Mess Request (List only, send/accept moved to mess-requests-route.js)
AuthRoute.get("/Profile/Messrequest/:id", MReqList);

// Hostel routes
AuthRoute.post("/Profile/Hostelprofile", Hprofile);
AuthRoute.get("/hostel/:id/profile", getHostelProfile);
AuthRoute.put("/hostel/:id/profile", updateHostelProfile);
AuthRoute.get("/Profile/Hostelrequest", Hrequest);
AuthRoute.post("/Profile/Hostelrequest/:id/:senderid", Hreq);
AuthRoute.get("/Profile/Hostelrequest/:id", hReqList);
AuthRoute.put("/Profile/Hostelrequest/:reqId/accept", acceptRequest);
AuthRoute.put("/Profile/Hostelrequest/:reqId/reject", rejectRequest);
AuthRoute.get("/Profile/Hostelrequest/:id/msglist", msglist);
AuthRoute.get("/Profile/hostelList", getHostelList);

// Student routes
AuthRoute.get("/Profile/Accepted-list/:id", acceptedlist);
AuthRoute.get("/Profile/student/:id/hostel", gethosteid);

// Message routes
AuthRoute.post("/Profile/messages/getAll", getAllMessages);

export default AuthRoute;
