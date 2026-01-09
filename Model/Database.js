const mongoose = require("mongoose")
const User = require("./UserModel")
const bcrypt = require("bcryptjs")

 exports.Connectdatabase = async() => {
    
        try{
            await mongoose.connect(process.env.MONGO_URL)
        console.log("Database connection successfull")
        }
    
        catch(error){
            console.log("Database Connection Failed",error)
        }


// Admin seeding

//check if admin is already there or not 

const isadminExists = await User.findOne({user_Email : "admin@gmail.com"})
    if(!isadminExists){
                await  User.create({
                    user_Email : "admin@gmail.com",
                    user_Password : "admin",
                    user_Role : "Admin",
                    user_Name : "admin",
                    user_Phone : "980000000"
                   })
            console.log("Admin Seeded Successfully")
    } else {
        console.log("Admin already seeded")
    }
    }

