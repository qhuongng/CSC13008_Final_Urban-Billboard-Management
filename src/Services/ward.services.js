const Ward = require("../Models/Ward");
const District = require("../Models/District");

const createWard = (newWard) => {
    return new Promise(async (resolve, reject) => {
        const { wardId, wardName, districtRefId } = newWard;
        try {
            const checkWard = await Ward.findOne({
                wardId: wardId,
                districtRefId: districtRefId,
            });
            const checkDistrict = await District.findOne({
                disId: districtRefId,
            });
            if (checkWard !== null) {
                reject({
                    status: "ERR",
                    message: "The Ward is already",
                });
            }
            if (checkDistrict == null) {
                return res.status(400).json({
                    status: "ERR",
                    message: "District not found",
                });
            }
            if (checkWard === null) {
                const newWard = await Ward.create({
                    wardId,
                    wardName,
                    districtRefId,
                });
                if (newWard) {
                    resolve({
                        status: "OK",
                        message: "SUCCESS",
                        data: newWard,
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};
const getWardName = (wardId, districtRefId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkWard = await Ward.findOne({
                wardId: wardId,
                districtRefId: districtRefId,
            });
            if (checkWard == null) {
                reject({
                    status: "ERR",
                    message: "The Ward not found",
                });
            } else {
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: checkWard.wardName,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};
module.exports = {
    createWard,
    getWardName,
};
