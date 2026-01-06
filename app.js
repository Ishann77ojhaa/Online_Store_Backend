const express = require("express")
const { connectdatabase } = require("./Database/Database")
const User = require("./Model/UserModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const app = express()
require("dotenv").config()

app.use(express.json())
app.use(express.urlencoded({extended : true}))

//Database Connection
 connectdatabase()

//test api to check if server is live or not
app.get("/",(req,res)=>{
    res.status(200).json({
        Message : "I am Alive"
    })
})

//Register User API
app.post("/register", async(req,res)=>{
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
})


//Login User API
  app.post("/login", async (req,res)=>{
    const {user_email, user_password} = req.body
    if(!user_email || !user_password){
        return res.status(400).json({
                message : "Enter Email and Password"
            })
  }

  // Check if that email exists or not 
  const founduser = await User.find({user_Email: user_email})

     if(founduser.length == 0){
            return res.status(404).json({
                message : "User with that Email Doesn't exists"
            })
     }

//Password Check
 const ismatched = bcrypt.compareSync(user_password,founduser[0].user_Password)
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
)
//PORT Starting
const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log("Server has started at PORT " + PORT)
})