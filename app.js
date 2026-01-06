const express = require("express")
const { connectdatabase } = require("./Database/Database")
const app = express()
require("dotenv").config()


//Database Connection
 connectdatabase()

//test api to check if server is live or not
app.get("/",(req,res)=>{
    res.status(200).json({
        Message : "I am Alive"
    })
})

//PORT Starting
const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log("Server has started at PORT " + PORT)
})