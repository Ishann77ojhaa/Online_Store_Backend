const mongoose = require("mongoose")
const schema = mongoose.schema

const Userschema = new schema({

    user_Email:{
        type : String,
        required : [true,"Email is Must"]
    },
    user_Phone:{
        type : Number,
        required : [true,"Phone is must"]
    },
    user_Password:{
        type : String,
        required : [true,"Password is must"]
    },
    user_Role:{
        type: String,
        enum : ["Customer","Admin"],
        default : "Customer"
    }
})

const User = mongoose.model("User",Userschema)
module.exports = User

