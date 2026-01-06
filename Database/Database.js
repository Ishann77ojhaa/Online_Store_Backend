const mongoose = require("mongoose")

 exports.connectdatabase = async() => {
    
        try{
            await mongoose.connect(process.env.MONGO_URL)
        console.log("Database connection successfull")
        }
    
        catch(error){
            console.log("Database Connection Failed",error)
        }
    }

