const User = require("../../Model/UserModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const sendEmail = require("../../Services/sendEmail")
const { options } = require("../../Routes/AuthRoutes")
require("dotenv").config()

//Register User Login 
exports.registerUser = async(req,res)=>{
    const {user_email,user_password,user_phone,user_name} = req.body
if(!user_email || !user_password || !user_phone || !user_name){
   return res.status(400).json({
        message : "Please provide email, phone, password"
    })
}

//Check if email is akready exists or not 
     const founduser =   await User.find({user_Email: user_email})

     if(founduser.length > 0){
            return res.status(400).json({
                message : "Email Already Exists!!"
            })
     }

 await User.create({
            user_Email : user_email,
            user_Phone : user_phone,
            user_Name : user_name,
            user_Password : bcrypt.hashSync(user_password,10)
            
 })
  res.status(201).json({
    message : "User Register Successfully"
  })
}


//login User Export
exports.loginUser = async (req,res)=>{
    const {user_email, user_password} = req.body
    if(!user_email || !user_password){
        return res.status(400).json({
                message : "Enter Email and Password"
            })
  }

  // Check if that email exists or not 
  const founduser = await User.find({user_email : User.user_Email})

     if(founduser.length == 0){
            return res.status(404).json({
                message : "User with that Email Doesn't exists"
            })
     }

//Password Check
 const ismatched = bcrypt.compareSync(user_password, founduser[0].user_Password)
     if(!ismatched){
        return res.status(400).json({
            message : "Invalid Password!!"
        })
    }


    //Token 
     const token = jwt.sign({id : founduser[0]._id},process.env.SECRET_KEY, {
        expiresIn : '30d'
      })


         res.status(200).json({
            message : "User Logged in Successfully",
            token
        })
     }

//Test 
exports.test = (req,res)=>{
    res.status(200).json({
        Message : "I am Alive"
    })
}


// forgotpassword-API
exports.forgotpassword = async(req,res)=>{
    const {user_email} = req.body
if(!user_email){
    return res.status(400).json({
        message : "Please Enter Your Email"
      })
}

//Check if email Exists or not
     const EmailExists  = await User.find({user_email : User.user_Email})
    if(EmailExists.length == 0 ){
        return res.status(400).json({
            message : "The Email You Entered is nor registered"
        })
    }
//Generate OTP
        const OTP = Math.floor( 1000 + Math.random() * 9000);
//save otp to database
EmailExists[0].OTP = OTP
await EmailExists[0].save()

//send email
   await sendEmail({
               email : user_email,
               subject : "Forgot password",
               message : `${OTP}`
   })

   res.status(200).json({
     message : "Email Sent!!"
   })

}


//Verify-OTP-API
exports.VerifyOTP = async (req,res)=>{
    const{user_email, otp} = req.body
if(!user_email || !otp){
    return res.status(400).json({
        message : "Please Provide Email and OTP"
    })
}

//Verify the OTP
const UserExists = await User.find({user_email : user_Email})

if(UserExists.length == 0){
    return res.status(400).json({
        message : "Email is not registered"
    })
}

if(UserExists[0].OTP !== otp){
    return res.status(200).json({
        message : "OTP Invalid"
    })
}

//Dispose OTP afer one time 
UserExists[0].OTP = undefined
await UserExists[0].save()

  res.status(200).json({
    message : "OTP verification Successfull!!"
  })
}


