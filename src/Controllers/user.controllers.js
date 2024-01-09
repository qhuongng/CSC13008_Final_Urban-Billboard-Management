const UserService = require('../Services/user.services');

const createUser = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        const allowedRoles = ['Ward', 'District', 'Department'];

        if (!name && !email && !password && !phone && !role) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Please input your information'
            })
        } else if (!name) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Please input your name'
            })
        } else if (!email) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Please input your email'
            })
        } else if (!password) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Please input your password'
            })
        } else if (!isCheckEmail) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Email format is invalid. Please check the email and try again.'
            })
        } else if (!allowedRoles.includes(role)) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Invalid user role',
            })
        }
        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email && !password) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Please input your email and password'
            })
        } else if (!email) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Please input your email'
            })
        } else if (!password) {
            return res.status(404).json({
                status: 'ERR',
                message: 'Please input your password'
            })
        }
        const response = await UserService.loginUser(req.body)

        const userLogin = response.checkUser;
        const token = response.accessToken;
        delete userLogin.password;
        req.session.auth = true;
        req.session.authUser = userLogin;
        req.session.accessToken = token;
        const url = req.session.retUrl || '/';
        res.redirect(url);
    } catch (e) {
        return res.render('login', {
            layout: false,
            err_message: e
        })
        // return res.status(404).json({
        //     message: e
        // })
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if (!userId) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }

        const response = await UserService.updateUser(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        //const token = req.headers
        if (!userId) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }

        const response = await UserService.deleteUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id
        //const token = req.headers
        if (!userId) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }

        const response = await UserService.getDetailsUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e,
            status: 'ERR',
        })
    }
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser
}