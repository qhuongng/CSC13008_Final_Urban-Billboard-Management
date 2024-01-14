const PositionType = require("../Models/PositionType");

const createTypePos = (newPosition) => {
  return new Promise(async (resolve, reject) => {
    const { posId, posName } = newPosition;
    try {
      const checkPosition = await PositionType.findOne({
        posId: posId,
      });

      if (checkPosition !== null) {
        reject({
          status: "ERR",
          message: "The Position is already",
        });
      }

      if (checkPosition === null) {
        const newPosition = await PositionType.create({
          posId,
          posName,
        });
        if (newPosition) {
          resolve({
            status: "OK",
            message: "SUCCESS",
            data: newPosition,
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getPositionName = (posId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkPosition = await PositionType.findOne({
        posId: posId,
      });
      if (checkPosition == null) {
        reject({
          status: "ERR",
          message: "The Position not found",
        });
      } else {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: checkPosition.posName,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getAllTypePos = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await PositionType.find();
      if (response.length === 0) {
        reject({
          status: "ERR",
          message: "The PositionType is empty",
        });
      } else {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: response,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createTypePos,
  getPositionName,
  getAllTypePos,
};
