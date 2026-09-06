const express = require("express")
const cors = require('cors')

const app = express()

const jwt = require("jsonwebtoken");
const { promisify } = require("util");


//Sending data to frontend with cors
const allowedOrigins = [
    "https://iecomify.vercel.app",
    "http://localhost:5174"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }
}));

app.use(express.json())
app.use(express.urlencoded({extended : true}))

const {Server} = require("socket.io")
const { Connectdatabase } = require("./Model/Database")



//Routes Here
const authrouter = require("./Routes/Auth/AuthRoutes")
const productrouter = require("./Routes/Admin/ProductRoutes")
const AdminUsersRoute = require("./Routes/Admin/AdminUsersRoute")
const UserReviewRoute = require("./Routes/User/UserReviewRoute")
const ProfileRoute = require("./Routes/User/ProfileRoute")
const CartRoute = require("./Routes/User/CartRoute")
const orderRoute = require("./Routes/User/orderRoute")
const AdminOrderRoute = require("./Routes/Admin/AdminOrderRoute")
const PaymentRoute = require("./Routes/User/PaymentRoute")
const User = require("./Model/UserModel");
const { getMe } = require("./Conroller/Authentication/AuthController");
const DashboardRoute = require("./Routes/Admin/DashboardRoute");

//Dot ENV
require("dotenv").config()


//Database Connection
Connectdatabase()

//All Routes Here
// All Routes Here
app.use("/api/auth", authrouter);
app.use("/api/product", productrouter);

app.use("/api/admin/stats", DashboardRoute);

app.use("/api/admin", AdminUsersRoute);
app.use("/api/admin", AdminOrderRoute);

app.use("/api/reviews", UserReviewRoute);
app.use("/api/profile", ProfileRoute);
app.use("/api/cart", CartRoute);
app.use("/api/order", orderRoute);
app.use("/api/payment", PaymentRoute);
app.use("/api/me", getMe);




//Telling node to give access to picture in uploads folder
app.use(express.static("uploads"))

//Test 
app.get("/", (req, res) => {
    res.status(200).json({
        message: "I am Alive, You MF"
    })
})

//PORT Starting
const PORT = process.env.PORT || 2000;
const server = app.listen(PORT,()=>{
    console.log("Server has started at PORT " + PORT)
})


const io = new Server(server,{
    cors : {
        origin : allowedOrigins,
    }
})

let onlineUsers = [];

const addToOnlineUsers = (socketId, userId, role)=>{
   onlineUsers =  onlineUsers.filter((user)=>user.userId.toString() !== userId.toString())
    onlineUsers.push({
        socketId,
        userId : userId.toString(),
        role})
}

io.on("connection",async(socket) =>{
    //Take token and validate it
    const token = socket.handshake.auth.token
    if(token){
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.SECRET_KEY
    );
    const user = await User.findById(decoded.id);
if(user){
    addToOnlineUsers(socket.id, user.id, user.user_Role)
}
}
socket.on("UpdateOrderStatus",({status, orderId, userId})=>{
    const findUser = onlineUsers.find((user)=>user.userId.toString() == userId.toString())
    io.to(findUser.socketId).emit("statusUpdated",{status, orderId})
})
})

// io.on("connection", (socket) => {
    
//     socket.on("register", async(data) => {
//     const {user_name, user_email, user_password, user_phone } = data

//     await User.create({
//              user_Email : user_email,
//              user_Name : user_name,
//              user_Phone : user_phone,
//              user_Password : user_password
//     })
// // socket.emit("response", { message : "User Registered Successfully"})
//  io.to(socket.id).emit("response",{ message : "User Registered Successfully"})
//     })
// })

function getSockerIO(){
    return io
}
module.exports.getSockerIO = getSockerIO 