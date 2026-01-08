const nodemailer = require("nodemailer")

    const sendEmail = async(options)=>{
    var trasporter = nodemailer.createTransport({
        service: "gmail",
    auth:{
        user: process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS,
    },
    });

const mailoptions = {
   from : "Online Store <onlinestore@gmail.com>",
   to : options.email,
   subject : options.subject,
   text : options.message,
};
await trasporter.sendMail(mailoptions);
    };

    module.exports = sendEmail



