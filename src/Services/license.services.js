const License = require('../Models/LicensePanel')

const createLicense = (idPoint, idPanel, content, imageId, companyName, companyEmail, companyPhone, startDay, endDay) => {
    return new Promise(async (resolve, reject) => {
        try {
            const createLicense = await License.create({
                idPoint: idPoint,
                idPanel: idPanel,
                content: content,
                imageId: imageId,
                companyName: companyName,
                companyEmail: companyEmail,
                companyPhone: companyPhone,
                startDay: startDay,
                endDay: endDay,
                isAccept: 0
            })
            if (createLicense) {
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: createLicense
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const getAllLicense = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const license = await License.find();
            if (!license) {
                reject({
                    status: 'ERR',
                    message: 'listLicense is empty'
                })
            }
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: license
            })
        } catch (error) {
            reject(error)
        }
    })
}
// những panel đã được accept rồi
const getAcceptedLicenseByIdPanel = (idPanel) => {
    return new Promise(async (resolve, reject) => {
        try {
            const license = await License.find({ idPanel: idPanel, isAccept: 1 }).sort({ createdAt: -1 })
            if (license) {
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: license
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const updateAccept = (idLicense, check) => {
    return new Promise(async (resolve, reject) => {
        try {
            const licenseUpdate = await License.findOneAndUpdate(
                { _id: idLicense },
                { isAccept: check },
                { new: true }
            )
            if (licenseUpdate) {
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: licenseUpdate
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    createLicense,
    getAllLicense,
    getAcceptedLicenseByIdPanel,
    updateAccept
}