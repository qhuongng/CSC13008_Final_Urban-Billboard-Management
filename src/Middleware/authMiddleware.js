const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const checkRole = (allowedRoles) => (req, res, next) => {
    if (allowedRoles === "ward") {
        if (req.session.authUser.role[0] !== "-1" && req.session.authUser.role[1] !== "-1") {
            next()
        }
        else {
            const errorMessage = "Bạn không có quyền truy cập";
            res.locals.error = errorMessage;
            return window.history.back();
        }
    }
}

const authLogin = (req, res, next) => {
    if (req.session.auth === false) {
        req.session.retUrl = req.originalUrl;
        return res.redirect('/api/user/login');
    }
    next();
};

module.exports = {
    checkRole,
    authLogin
}