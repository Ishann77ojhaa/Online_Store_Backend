const jwt = require("jsonwebtoken")


const isAuthenticated =(req,res,next)=>{
const token = req.headers.authorization

if(!token){
    res.status(400).json({
        message : "Please Send Token"
    })
}else{
    jwt.verify(token, process.env.SECRET_KEY, (err,success)=>{
         if(err){
            res.status(400).json({
                message : "Invalid Token"
            })
         }else{
            res.status(200).json({
                message : "Valid Token",
            })
            req.user = success
            next()
         }
    })
}
}

module.exports = isAuthenticated

