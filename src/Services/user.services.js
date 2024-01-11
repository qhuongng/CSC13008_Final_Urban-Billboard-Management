const User = require("../Models/Users")
const { generalAccessToken } = require("./JwtService")
const bcrypt = require("bcrypt")


const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, date, password, phone, role } = newUser
        try {
            const checkUser = await User.findOne({
                email: email
            })

            if (checkUser !== null) {
                reject('The email is already');
            }
            const hash = bcrypt.hashSync(password, 10)

            if (checkUser === null) {
                console.log(1);
                const createUser = await User.create({
                    name,
                    date,
                    email,
                    password: hash,
                    phone,
                    role
                })
                if (createUser) {
                    resolve({
                        status: 'OK',
                        message: 'SUCCESS',
                        data: createUser
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null) {
                reject('The user is not defined');
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            if (!comparePassword) {
                reject('The password or username is incorrect');
            }
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                checkUser,
            })
        } catch (e) {
            reject(e)
        }
    })
}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                reject('The user is not defined');
            }
            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'Update user success',
                data: updatedUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const updatePassWord = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null) {
                reject('The user is not defined');
            }
            const hash = bcrypt.hashSync(password, 10)
            const updatePassWord = { $set: { password: hash } }
            const updatedUser = await User.findOneAndUpdate({ email: email }, updatePassWord, { new: true })
            resolve({
                status: 'OK',
                message: 'Update user success',
                data: updatedUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                reject('The user is not defined');
            }
            await User.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete user success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find()
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allUser

            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: id
            })
            if (user === null) {
                reject('The user is not defined');
            }
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: user
            })
        } catch (e) {
            reject(e)
        }
    })
}



module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    updatePassWord
}