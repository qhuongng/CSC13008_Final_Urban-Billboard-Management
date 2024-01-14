const licenseImg = require('../Models/ImageLicense')

const getLicenseImg = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkId = await licenseImg.findById(id);
            if (!checkId) {
                reject({
                    status: 'ERR',
                    message: 'The ImgLicense not found'
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

const sendLicenseImg = (files) => {
    return new Promise(async (resolve, reject) => {
        try {
            const upImg = await licenseImg.create(files);
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
    getLicenseImg,
    sendLicenseImg
}