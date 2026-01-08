const express = require("express")
const app = express()
const { registerUser, loginUser, test } = require("./Conroller/Authentication/AuthController")
const { Connectdatabase } = require("./Model/Database")
const router = require("./Routes/AuthRoutes")
require("dotenv").config()

app.use(express.json())
app.use(express.urlencoded({extended : true}))

//Database Connection
Connectdatabase()

//All Routes Here
app.use("",router)


//PORT Starting
const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log("Server has started at PORT " + PORT)
})