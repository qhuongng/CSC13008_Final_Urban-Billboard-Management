const Point = require("../Models/Point");
const Ward = require("../Models/Ward");
const District = require("../Models/District");
const Panel = require("../Models/Panel");
const wardServices = require("../Services/ward.services");
const districtServices = require("../Services/district.services");
const positionServices = require("../Services/positionType.services");
const adsFormServices = require("../Services/adsForm.services");

const createPoint = (newPoint) => {
  return new Promise(async (resolve, reject) => {
    const {
      name,
      address,
      area,
      locate,
      positionType,
      formAdvertising,
      picturePoint,
      isZoning,
    } = newPoint;
    try {
      const checkPoint = await Point.findOne({
        name: name,
        address: address,
      });

      if (checkPoint !== null) {
        resolve({
          status: "OK",
          message: "The Point is already",
        });
      }

      if (checkPoint === null) {
        const { wardId, disId } = area;
        const ward = await Ward.findOne({
          wardId: wardId,
          districtRefId: disId,
        });
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
          havePanel: false,
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
          const wardName = (
            await wardServices.getWardName(
              newPoint.area.ward,
              newPoint.area.district
            )
          ).data;
          const districtName = (
            await districtServices.getDistrictName(newPoint.area.district)
          ).data;
          newPoint.area = { ward: wardName, district: districtName };
          newPoint.positionType = (
            await positionServices.getPositionName(newPoint.positionType)
          ).data;
          newPoint.formAdvertising = (
            await adsFormServices.getAdsFormName(newPoint.formAdvertising)
          ).data;
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

const getPointById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const point = await Point.findOne({ _id: id });
      if (point === null) {
        resolve({
          status: "OK",
          message: "The Point is not defined",
        });
      }
      const wardName = (
        await wardServices.getWardName(
          point.area.ward,
          point.area.district
        )
      ).data;
      const districtName = (
        await districtServices.getDistrictName(point.area.district)
      ).data;

      point.area = { ward: wardName, district: districtName };
      point.positionType = (
        await positionServices.getPositionName(point.positionType)
      ).data;
      point.formAdvertising = (
        await adsFormServices.getAdsFormName(point.formAdvertising)
      ).data;

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: point,
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
      const updatePoint = await Point.findByIdAndUpdate(id, data, {
        new: true,
      });
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
const updateHavePanel = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkPoint = await Point.findOne({
                _id: id,
            });
            if (checkPoint === null) {
                reject("The Point is not defined")
            }
            const checkPanel = await Panel.findOne({
                idPoint: id
            })
            if (checkPanel) {
                const update = { $set: { havePanel: true } }
                const updatePoint = Point.findOneAndUpdate(
                    { _id: id },
                    update,
                    { new: true }
                )
                resolve({
                    data: updatePoint
                })
            }
            else {
                const update = { $set: { havePanel: false } }
                const updatePoint = Point.findOneAndUpdate(
                    { _id: id },
                    update,
                    { new: true }
                )
                resolve({
                    data: updatePoint
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const getPointByDis = async (disName) => {
    try {
        const district = await District.findOne({ disName: disName });
        const points = await Point.find({ 'area.district': district.disId });

        const updatePoints = await Promise.all(
            points.map(async (point) => {
                const newPoint = { ...point.toObject() };
                const wardName = (await wardServices.getWardName(newPoint.area.ward, newPoint.area.district)).data;
                const districtName = (await districtServices.getDistrictName(newPoint.area.district)).data;
                newPoint.area = { ward: wardName, district: districtName };
                newPoint.positionType = (await positionServices.getPositionName(newPoint.positionType)).data;
                newPoint.formAdvertising = (await adsFormServices.getAdsFormName(newPoint.formAdvertising)).data;
                return newPoint;
            })
        );

        return {
            status: 'OK',
            message: 'SUCCESS',
            data: updatePoints,
        };
    } catch (error) {
        return {
            status: 'ERR',
            message: error.message,
        };
    }
};

const getPointByWardAndDis = async (wardName, disName) => {
    try {
        const ward = await Ward.findOne({ wardName: wardName });
        const district = await District.findOne({ disName: disName });

        const points = await Point.find({ 'area.ward': ward.wardId, 'area.district': district.disId });

        const updatePoints = await Promise.all(
            points.map(async (point) => {
                const newPoint = { ...point.toObject() };
                const wardName = (await wardServices.getWardName(newPoint.area.ward, newPoint.area.district)).data;
                const districtName = (await districtServices.getDistrictName(newPoint.area.district)).data;
                newPoint.area = { ward: wardName, district: districtName };
                newPoint.positionType = (await positionServices.getPositionName(newPoint.positionType)).data;
                newPoint.formAdvertising = (await adsFormServices.getAdsFormName(newPoint.formAdvertising)).data;
                return newPoint;
            })
        );

        return {
            status: 'OK',
            message: 'SUCCESS',
            data: updatePoints,
        };
    } catch (error) {
        return {
            status: 'ERR',
            message: error.message,
        };
    }
};
module.exports = {
    createPoint,
    getAllPoint,
    deletePoint,
    updatePoint,
    updateHavePanel,
    getPointByDis,
    getPointByWardAndDis
};
