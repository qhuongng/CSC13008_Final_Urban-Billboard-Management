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
module.exports = {
    createDistrict,
    getDistrictName,
};
