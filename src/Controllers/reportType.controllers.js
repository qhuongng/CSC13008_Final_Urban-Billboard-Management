const ReportTypeService = require("../Services/reportType.services");

const createTypeReport = async (req, res) => {
  try {
    const reportName = req.body.reportName;
    console.log(reportName);
    const response = await ReportTypeService.createTypeReport(reportName);
    if (response.status === "ERR") {
      return res.status(205).json(response);
    }
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllReportType = async (req, res) => {
  try {
    const response = await ReportTypeService.getAllReportType();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateReportType = async (req, res) => {
  try {
    const { id, reportName } = req.body;
    const response = await ReportTypeService.updateReportType(id, reportName);
    if (response.status === "OK") {
      return res.status(200).json(response);
    } else {
      return res.status(205).json(response);
    }
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteReportType = async (req, res) => {
  try {
    console.log(req.body);
    const id = req.body.id;
    console.log(id);
    const response = await ReportTypeService.deleteReportType(id);
    console.log(response);
    if (response.status === "OK") {
      return res.status(200).json(response);
    }
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
}

module.exports = {
  createTypeReport,
  getAllReportType,
  updateReportType,
  deleteReportType
};
