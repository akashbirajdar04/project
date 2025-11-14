import { body } from "express-validator";
import { Asynchandler } from "../utills/Aynchandler.js";
export const uservalid=function()
{
    console.log("11")
     return  [
        
        body("email").trim()
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("email is not valid"),
        body("username")
        .trim()
        .notEmpty()
        .withMessage("username is required")
        .isLength({min:3})
        .withMessage("username length is less than 3"),
        body("fullname")
        .optional()
     ]
}
  export  const loginuservalid=function ()
{
     console.log("12")
    return  [
       body("email").trim()
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("email is not valid"),
       body("password").trim()
       .notEmpty()
       .withMessage("enter the password")
       .isLength({min:3})
     ]
}
export const userchangecurrentpassword=Asynchandler(async(req,res)=>{  
 
 return [
  body("oldpassword").trim().withMessage("enter ths oldpassword")
  ,
  body("newpassword").trim().withMessage("enter the newpassword")
 ]
})
export const userforgotpassword=Asynchandler(async(req,res)=>{
  return [
          body("email")
          .notEmpty()
          .withMessage("email is required")
          .isEmail()
          .withMessage("email is invalid")
  ]
})
export const userforgotresetpassword=Asynchandler(async(req,res)=>{
  return [
       body("newpassword").
       notEmpty()
       .withMessage("pasword is required")
       
  ]
})