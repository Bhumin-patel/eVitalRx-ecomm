const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'torey45@ethereal.email',
        pass: 'chjs5eCN37pXsHKZC2'
    }
});

exports.sendOTPMail = async (email,otp) => {
    
    await transporter.sendMail({
        from: 'torey45@ethereal.email', 
        to: "torey45@ethereal.email", 
        subject: "OTP", 
        text: `OTP is ${otp}`
    });

};