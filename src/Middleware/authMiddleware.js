const authLogin = (req, res, next) => {
    if (req.session.auth === false) {
        req.session.retUrl = req.originalUrl;
        return res.redirect('/');
    }
    next();
};

module.exports = {
    authLogin
}