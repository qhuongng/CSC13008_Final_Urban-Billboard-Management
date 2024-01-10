const OtpService = require("../Services/otp.services");

const saveOtp = async (req, res) => {
    try {
        const email = req.body.email
        if (!email) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Inpur is required'
            })
        }
        const checkOtp = await OtpService.saveOtp(email);
        if (checkOtp) {
            res.status(200).json("OTP have sent")
        }
    } catch (e) {
        // sẽ render lại cái trang đó sau
        // return res.status(404).json({
        //     message: e
        // })
        return res.render('resetPassword', {
            layout: false,
            err_message: e
        })
    }
}

const checkOtp = async (req, res) => {
    try {
        const { email, password, otp } = req.body

        if (!email || !password || !otp) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Inpur is required'
            })
        }
        const checkOtp = await OtpService.checkAndDeleteOtp(email, password, otp);
        if (checkOtp) {
            //res.redirect('login');

            res.status.json({ message: true })
        }
    } catch (e) {
        // sẽ render lại cái trang đó sau
        return res.status(404).json({
            message: e
        })
    }
}
module.exports = {
    saveOtp,
    checkOtp
}