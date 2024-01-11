const OTP = require('../Models/Otp')
const User = require('../Models/Users')
const nodemailer = require('nodemailer');
const UserService = require('../Services/user.services')
require("dotenv").config();
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSEMAIL
    }
});
const saveOtp = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkMail = await User.findOne({ email: email })
            if (!checkMail) {
                console.log(123);
                reject("User not found!");
            }
            const otp = Math.floor(100000 + Math.random() * 900000);

            const mailOptions = {
                from: 'Admin Map Application',
                to: email,
                subject: 'OTP để cập nhập password',
                html: `
                <h3>Xin chào ${checkMail.name},</h3>
                <p>Bạn đã chọn email: ${email} làm email để cập nhập mật khẩu, mã OTP để cập nhập tài khoản là:</p>
                <br>
                <h2 style="color: red;">${otp}</h2>
                <br>
                <p>Vui lòng không chia sẻ mã OTP này với người khác</p>
                `
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    reject(error)
                }
            })
            const checkOtp = await OTP.findOne({ email: email })
            if (!checkOtp) {
                const newOtp = await OTP.create({
                    email: email,
                    otp: otp
                })
                if (newOtp) {
                    resolve({
                        data: newOtp
                    })
                }
            }
            else {
                const update = { $set: { otp: otp } }
                const updateOtp = await OTP.findOneAndUpdate(
                    { email: email },
                    update,
                    { new: true }
                )
                if (updateOtp) {
                    resolve({
                        data: updateOtp
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

const checkAndDeleteOtp = (email, password, otpCheck) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkMail = await User.findOne({ email: email })
            if (!checkMail) {
                reject("User not found!");
            }
            const checkOtp = await OTP.findOne({ email: email })
            if (!checkOtp) {
                reject("No OTP to check");
            }
            else {
                if (checkOtp.otp !== parseInt(otpCheck)) {
                    reject("OTP is not valid");
                }
                else {
                    await OTP.deleteOne({ email: email });
                    const updateUser = await UserService.updatePassWord(email, password);
                    resolve({
                        data: updateUser
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    saveOtp,
    checkAndDeleteOtp
}