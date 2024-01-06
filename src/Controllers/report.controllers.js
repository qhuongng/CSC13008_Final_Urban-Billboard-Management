const { report } = require("../Routers/report.routes");
const reportService = require("../Services/report.services");

const createReport = async (req, res) => {
  try {
    console.log(req.body);
    const report = await reportService.createReport(req.body);
    res.status(200).json({ report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNewReport = async (req, res) => {
  try {
    const report = await reportService.getNewReport();
    res.status(200).json({ report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const showReport = async (req, res) => {
  const location = req.query.location;
  res.render("report", { location });
};

module.exports = {
  createReport,
  getNewReport,
  showReport,
};
