const District = require("../Models/District");

const createDistrict = (newDistrict) => {
    return new Promise(async (resolve, reject) => {
        const { disId, disName } = newDistrict;
        try {
            const checkDistrict = await District.findOne({
                disId: disId,
            });

            if (checkDistrict !== null) {
                reject({
                    status: "ERR",
                    message: "The District is already",
                });
            }

            if (checkDistrict === null) {
                const newDistrict = await District.create({
                    disId,
                    disName,
                });
                if (newDistrict) {
                    resolve({
                        status: "OK",
                        message: "SUCCESS",
                        data: newDistrict,
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getDistrictName = (disId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkDistric = await District.findOne({
                disId: disId,
            });
            if (checkDistric == null) {
                reject({
                    status: "ERR",
                    message: "The disId not found",
                });
            } else {
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: checkDistric.disName,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const updateDistrict = (disId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkDis = await District.findOne({
                disId: disId
            });
            if (!checkDis) {
                reject('The District is not defined');
            }
            const updatedDistrict = await District.findOneAndUpdate(
                { disId: disId },
                data,
                { new: true }
            );
            resolve({
                status: 'OK',
                message: 'Update District success',
                data: updatedDistrict
            });
        } catch (e) {
            reject(e);
        }
    });
};

const deleteDistrict = (disId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkDis = await District.findOne({
                disId: disId
            });
            if (!checkDis) {
                reject('The District is not defined');
            }
            await District.findOneAndDelete({ disId: disId });
            resolve({
                status: 'OK',
                message: 'Delete District success',
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllDis = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allDis = await District.find()
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allDis

            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createDistrict,
    getDistrictName,
    updateDistrict,
    deleteDistrict,
    getAllDis
};
