import express from "express";
import { uservalid, loginuservalid } from "../validators/uservalid.js";
import { validateuser } from "../middleware/validate.middle.js";
import { userRegistration, UserLogin } from "../controllers/user-reg.js";
import { logout } from "../controllers/user-reg.js";
import { verifyjwt } from "../middleware/auth.middle.js";
import { resendemail } from "../controllers/user-reg.js";
import { Hprofile } from "../controllers/user-reg.js";
import { Mprofile, getMessProfile } from "../controllers/user-reg.js";
import { Hrequest } from "../controllers/user-reg.js";
import { Hreq } from "../controllers/user-reg.js";
import { MReqList } from "../controllers/user-reg.js";
import { hReqList } from "../controllers/user-reg.js";
import { acceptRequest } from "../controllers/user-reg.js";
import { rejectRequest } from "../controllers/user-reg.js";
import { acceptedlist } from "../controllers/user-reg.js";
import { msglist } from "../controllers/user-reg.js";
import { gethosteid } from "../controllers/user-reg.js";
import { getAllMessages } from "../controllers/user-reg.js";
const AuthRoute = express.Router();  // fixed name
console.log("Hreq type:", typeof Hreq); 
// Register route
AuthRoute.post("/register", uservalid(), validateuser, userRegistration);

// Login route
AuthRoute.post("/login",  UserLogin);//loginuservalid(), validateuser,
AuthRoute.post("/logout",verifyjwt,logout) ;
AuthRoute.post("/resendemail",verifyjwt,resendemail)
AuthRoute.post("/Profile/Messprofile",Mprofile)  
AuthRoute.get("/Profile/Messprofile/:id", getMessProfile)
AuthRoute.post("/Profile/Hostelprofile",Hprofile)
AuthRoute.get("/Profile/Hostelrequest",Hrequest)
AuthRoute.post("/Profile/Hostelrequest/:id/:senderid",Hreq)
AuthRoute.get("/Profile/Hostelrequest/:id",hReqList)
AuthRoute.get("/Profile/Messrequest/:id",MReqList)
AuthRoute.put("/Profile/Hostelrequest/:reqId/accept", acceptRequest);
AuthRoute.put("/Profile/Hostelrequest/:reqId/reject", rejectRequest);
AuthRoute.get("/Profile/Accepted-list/:id",acceptedlist)
AuthRoute.get("/Profile/Hostelrequest/:id/msglist",msglist)
AuthRoute.get("/Profile/student/:id/hostel",gethosteid)
AuthRoute.post("/Profile/messages/getAll",getAllMessages)
// AuthRoute.post("/Mprofile",messadd)
export default AuthRoute;
