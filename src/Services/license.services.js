const License = require('../Models/LicensePanel')
const Point = require('../Models/Point')
const Ward = require("../Models/Ward");
const District = require("../Models/District");

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

const getLicenseByIdPointWardDis = async (wardName, districtName) => {
    try {
        const ward = await Ward.findOne({ wardName: wardName });
        if (!ward) {
            throw {
                status: 'ERR',
                message: 'Ward is undefined'
            };
        }

        const district = await District.findOne({ disName: districtName });
        if (!district) {
            throw {
                status: 'ERR',
                message: 'District is undefined'
            };
        }

        const points = await Point.find({
            'area.ward': ward.wardId,
            'area.district': district.disId
        });

        if (points.length === 0) {
            throw {
                status: 'ERR',
                message: 'No points found for the specified ward and district'
            };
        }

        const licenses = await License.find({ idPoint: { $in: points.map(point => point._id) } });

        if (licenses.length === 0) {
            throw {
                status: 'ERR',
                message: 'No licenses found for the specified points'
            };
        }

        return {
            status: 'OK',
            message: 'SUCCESS',
            data: licenses
        };

    } catch (error) {
        return {
            status: 'ERR',
            message: 'Error in processing',
            error: error
        };
    }
};


const deleteLicense = (licenseId) => {
    return new Promise(async (resolve, reject) => {
        try {
            await License.findOneAndDelete({
                _id: licenseId
            });
            resolve({
                status: 'OK',
                message: 'Delete Ward success',
            });
        } catch (e) {
            reject(e);
        }
    });
};


module.exports = {
    createLicense,
    getAllLicense,
    getAcceptedLicenseByIdPanel,
    updateAccept,
    getLicenseByIdPointWardDis,
    deleteLicense
}