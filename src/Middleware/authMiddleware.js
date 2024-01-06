const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const authMiddleware = (allowedRoles) => (req, res, next) =>{
    const token = req.headers.token.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, user) {
        if(err){
            return res.status(404).json({
                message: 'Your access timed out',
                status: 'ERR'
            })
        }
        const {payload} = user
        if (allowedRoles.includes(payload?.role)){
            next()
        }else{
            return res.status(404).json({
                message: 'You do not have permission',
                status: 'ERR'
            })
        }
      });
}


module.exports = {
    authMiddleware,
}