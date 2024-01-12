const express = require("express");
const router = express.Router();
const controlReportType = require("../Controllers/reportType.controllers");

router.get("/", (req, res) => {
  res.render("Controls/reportType/reportType");
});

router.put("/edit", controlReportType.updateReportType);

module.exports = router;
