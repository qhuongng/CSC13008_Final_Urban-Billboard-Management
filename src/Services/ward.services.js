const Ward = require("../Models/Ward");
const District = require("../Models/District");

const createWard = (newWard) => {
    return new Promise(async (resolve, reject) => {
        const { wardName, districtRefId } = newWard;
        try {
            const checkWardByName = await Ward.findOne({
                wardName: wardName,
                districtRefId: districtRefId,
            });
            if (checkWardByName === null) {
                let wardId
                const cleanedNamewar = wardName.trim();
                const withoutPrefixwar = cleanedNamewar.replace("Phường ", "");
                if (withoutPrefixwar.length > 2) {
                    wardId = 'P' + withoutPrefixwar.split(' ').map(word => word[0]).join('');
                }
                else {
                    wardId = 'P' + (withoutPrefixwar.length === 2 ? withoutPrefixwar : '0' + withoutPrefixwar)
                }
                const newWard = await Ward.create({
                    wardId: wardId,
                    wardName: wardName,
                    districtRefId: districtRefId,
                });
                if (newWard) {
                    resolve({
                        status: "OK",
                        message: "SUCCESS",
                        data: newWard,
                    });
                }
            } else {
                resolve({
                    status: "ERR",
                    message: "The Ward is already",
                });
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

const updateWard = (wardId, wardName, districtRefId) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(wardId);
            console.log(wardName);
            console.log(districtRefId);
            const checkWard = await Ward.findOne({
                wardName: wardName,
                districtRefId: districtRefId
            });
            console.log(checkWard);
            if (checkWard) {
                resolve({
                    status: "ERR",
                    message: "The Ward Name is already"
                });
            }
            const updatedWard = await Ward.findOneAndUpdate(
                { wardId: wardId, districtRefId: districtRefId },
                { wardName: wardName },
                { new: true }
            );
            resolve({
                status: 'OK',
                message: 'Update Ward success',
                data: updatedWard
            });
        } catch (e) {
            reject(e);
        }
    });
};

const deleteWard = (wardId, districtRefId) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Ward.findOneAndDelete({
                wardId: wardId,
                districtRefId: districtRefId
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

const getAllWard = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allWard = await Ward.find()
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allWard

            })
        } catch (e) {
            reject(e)
        }
    })
}

const getWardsByDistrictId = (districtId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const district = await District.findOne({ disId: districtId });
            if (!district) {
                reject('District not found');
            }

            const wards = await Ward.find({ districtRefId: district.disId });

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: wards
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getWardsByDistrictName = async (districtName) => {
    try {
        const district = await District.findOne({ disName: districtName });

        if (!district) {
            throw new Error('District not found');
        }

        const wards = await Ward.find({ districtRefId: district.disId });

        return {
            status: 'OK',
            message: 'SUCCESS',
            data: wards
        };
    } catch (error) {
        throw error;
    }
};

const getWardById = (wardId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkWard = await Ward.findOne({
                wardId: wardId,
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
                    data: checkWard,
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
    updateWard,
    deleteWard,
    getAllWard,
    getWardsByDistrictId,
    getWardsByDistrictName,
    getWardById
};
