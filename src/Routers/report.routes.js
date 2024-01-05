const express = require("express");
const router = express.Router();
const reportController = require("../Controllers/report.controllers");

router.post("/createReport", reportController.createReport);
router.get("/getNewReport", reportController.getNewReport);
router.get("/", reportController.showReport);
router.get("/showReport", reportController.showReport);

module.exports = router;
