const authLogin = (req, res, next) => {
    if (req.session.auth === false) {
        req.session.retUrl = req.originalUrl;
        return res.redirect('/api/user/login');
    }
    next();
};

module.exports = {
    authLogin
}