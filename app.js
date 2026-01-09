const express = require("express")
const app = express()
const { registerUser, loginUser, test } = require("./Conroller/Authentication/AuthController")
const { Connectdatabase } = require("./Model/Database")
const authrouter = require("./Routes/AuthRoutes")
const productrouter = require("./Routes/ProductRoutes")

require("dotenv").config()

app.use(express.json())
app.use(express.urlencoded({extended : true}))

//Database Connection
Connectdatabase()

//All Routes Here
app.use("/api",authrouter)
app.use("/api",productrouter)


//PORT Starting
const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log("Server has started at PORT " + PORT)
})