const { model } = require('mongoose');
const reportImg = require('../Models/Image')

const getReportImg = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkId = await reportImg.findById(id);
            if (!checkId) {
                reject({
                    status: 'ERR',
                    message: 'The ImgReport not found'
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

const sendReportImg = (files) => {
    return new Promise(async (resolve, reject) => {
        try {
            const upImg = await reportImg.create(files);
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
    getReportImg,
    sendReportImg
}