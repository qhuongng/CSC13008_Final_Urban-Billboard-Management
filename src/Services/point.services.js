const Point = require("../Models/Point");
const Ward = require("../Models/Ward");
const District = require("../Models/District");
const wardServices = require("../Services/ward.services");
const districtServices = require("../Services/district.services");
const positionServices = require("../Services/positionType.services");
const adsFormServices = require("../Services/adsForm.services");

const createPoint = (newPoint) => {
    return new Promise(async (resolve, reject) => {
        const { name, address, area, locate, positionType, formAdvertising, picturePoint, isZoning } = newPoint;
        try {
            const checkPoint = await Point.findOne({
                name: name,
                address: address
            });

            if (checkPoint !== null) {
                resolve({
                    status: "OK",
                    message: "The Point is already",
                });
            }

            if (checkPoint === null) {
                const { wardId, disId } = area;
                const ward = await Ward.findOne({ wardId: wardId, districtRefId: disId });
                if (ward === null) {
                    reject({
                        status: "ERR",
                        message: "Ward not found",
                    });
                }
                const district = await District.findOne({ disId: disId });

                if (district === null) {
                    reject({
                        status: "ERR",
                        message: "District not found",
                    });
                }
                const newPoint = await Point.create({
                    name,
                    address,
                    //area: {ward: ward.wardName, district: district.disName},
                    area,
                    locate,
                    positionType,
                    formAdvertising,
                    picturePoint,
                    isZoning,
                });
                if (newPoint) {
                    resolve({
                        status: "OK",
                        message: "SUCCESS",
                        data: newPoint,
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getAllPoint = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allPoint = await Point.find();
            const updatePoints = await Promise.all(
                allPoint.map(async (point) => {
                    const newPoint = { ...point.toObject() };
                    const wardName = (await wardServices.getWardName(newPoint.area.ward, newPoint.area.district)).data;
                    const districtName = (await districtServices.getDistrictName(newPoint.area.district)).data;
                    newPoint.area = { ward: wardName, district: districtName };
                    newPoint.positionType = (await positionServices.getPositionName(newPoint.positionType)).data;
                    newPoint.formAdvertising = (await adsFormServices.getAdsFormName(newPoint.formAdvertising)).data;
                    return newPoint;
                })
            );
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: updatePoints,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const deletePoint = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkPoint = await Point.findOne({
                _id: id,
            });
            if (checkPoint === null) {
                resolve({
                    status: "OK",
                    message: "The Point is not defined",
                });
            }
            await Point.findByIdAndDelete(id);
            resolve({
                status: "OK",
                message: "Delete Point success",
            });
        } catch (e) {
            reject(e);
        }
    });
};

const updatePoint = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkPoint = await Point.findOne({
                _id: id,
            });
            if (checkPoint === null) {
                resolve({
                    status: "OK",
                    message: "The Point is not defined",
                });
            }
            const updatePoint = await Point.findByIdAndUpdate(id, data, { new: true });
            resolve({
                status: "OK",
                message: "Update Point success",
                data: updatePoint,
            });
        } catch (e) {
            reject(e);
        }
    });
};
module.exports = {
    createPoint,
    getAllPoint,
    deletePoint,
    updatePoint,
};
