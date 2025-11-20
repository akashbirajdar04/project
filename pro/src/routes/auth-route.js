import express from "express";
import { uservalid, loginuservalid } from "../validators/uservalid.js";
import { validateuser } from "../middleware/validate.middle.js";
import {
  userRegistration,
  UserLogin,
  logout,
  resendemail,
  Hprofile,
  Mprofile,
  getMessProfile,
  Hrequest,
  Hreq,
  MReqList,
  hReqList,
  acceptRequest,
  rejectRequest,
  acceptedlist,
  msglist,
  gethosteid,
  getAllMessages,
} from "../controllers/user-reg.js";
import { verifyjwt } from "../middleware/auth.middle.js";
const AuthRoute = express.Router();

AuthRoute.post("/register", uservalid(), validateuser, userRegistration);
AuthRoute.post("/login", UserLogin); //loginuservalid(), validateuser,
AuthRoute.post("/logout", verifyjwt, logout);
AuthRoute.post("/resendemail", verifyjwt, resendemail);
AuthRoute.post("/Profile/Messprofile", Mprofile);
AuthRoute.get("/Profile/Messprofile/:id", getMessProfile);
AuthRoute.post("/Profile/Hostelprofile", Hprofile);
AuthRoute.get("/Profile/Hostelrequest", Hrequest);
AuthRoute.post("/Profile/Hostelrequest/:id/:senderid", Hreq);
AuthRoute.get("/Profile/Hostelrequest/:id", hReqList);
AuthRoute.get("/Profile/Messrequest/:id", MReqList);
AuthRoute.put("/Profile/Hostelrequest/:reqId/accept", acceptRequest);
AuthRoute.put("/Profile/Hostelrequest/:reqId/reject", rejectRequest);
AuthRoute.get("/accepted-list/:id", acceptedlist);
AuthRoute.get("/Profile/Hostelrequest/:id/msglist", msglist);
AuthRoute.get("/Profile/student/:id/hostel", gethosteid);
AuthRoute.post("/Profile/messages/getAll", getAllMessages);

export default AuthRoute;
