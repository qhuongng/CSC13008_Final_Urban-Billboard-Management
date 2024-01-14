const pointImg = require('../Models/ImagePoint')

const getPointImg = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkId = await pointImg.findById(id);
            if (!checkId) {
                reject({
                    status: 'ERR',
                    message: 'The ImgPoint not found'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: checkId
            })
        } catch (e) {
            reject(e)
        }
    })
}

const sendPointImg = (files) => {
    return new Promise(async (resolve, reject) => {
        try {
            const upImg = await pointImg.create(files);
            if (!upImg) {
                reject({
                    status: 'ERR',
                    message: 'Error in save Img'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: upImg
            })
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    getPointImg,
    sendPointImg
}