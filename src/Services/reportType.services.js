const ReportType = require("../Models/ReportType");

const createTypeReport = (reportName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkReportType = await ReportType.findOne({
        reportName: reportName,
      });
      console.log(checkReportType);
      if (checkReportType !== null) {
        reject({
          status: "ERR",
          message: "The Report Type is already",
        });
      }

      if (checkReportType === null) {
        const idBefore = (await ReportType.findOne({}).sort({ reportId: -1 })).reportId;
        const count = parseInt(idBefore.slice(1), 10);
        let id;
        if (count < 10) {
          id = "0" + (count + 1).toString();
        } else {
          id = (count + 1).toString();
        }

        const reportId = "R" + id;
        const newTypeReport = await ReportType.create({
          reportId: reportId,
          reportName: reportName,
        });
        console.log(newTypeReport);
        if (newTypeReport) {
          resolve({
            status: "OK",
            message: "SUCCESS",
            data: newTypeReport,
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getReportTypeName = (reportId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkReportType = await ReportType.findOne({
        reportId: reportId,
      });
      if (checkReportType == null) {
        reject({
          status: "ERR",
          message: "The Report Type not found",
        });
      } else {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: checkReportType.reportName,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getAllReportType = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allPanelType = await ReportType.find();
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: allPanelType,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateReportType = (reportId, reportName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updatereport = await ReportType.findOne({
        reportName: reportName
      })
      if (updatereport !== null) {
        resolve({
          status: "ERR",
          message: "ReportType Name is already"
        })
      } else {
        const update = await ReportType.findOneAndUpdate(
          { reportId: reportId },
          { reportName: reportName },
          { new: true }
        )
        resolve({
          status: "OK",
          message: "update compeleted"
        })
      }
    }
    catch (e) {
      reject(e)
    }
  })
}

const deleteReportType = (reportId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await ReportType.findOneAndDelete({ reportId: reportId })
      resolve({
        status: "OK",
        message: "delete complete"
      })
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  createTypeReport,
  getReportTypeName,
  getAllReportType,
  updateReportType,
  deleteReportType
};
