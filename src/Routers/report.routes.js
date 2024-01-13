const express = require("express");
const router = express.Router();
const reportController = require("../Controllers/report.controllers");
const multer = require('multer');

// router.get("/", reportController.showReport);
// router.get("/showReport", reportController.showReport);
//--------------------------
router.get('/getAllReport', reportController.getAllReport);
router.get('/:id', reportController.showReport);
router.get('/getReport/:id', reportController.getReport);
router.get('/getReportByWard/:name', reportController.getReportByWard)
router.get('/getReportByDis/:name', reportController.getReportByDis)
router.get('/getReportByWardAndDis/:wardName/:districtName', reportController.getReportByWardAndDis);
router.get('/getReportByEmail/:email', reportController.getReportByEmail)
router.get('/getReportByWardAndDisAndEmail/:wardName/:districtName/:email', reportController.getReportByWardAndDisAndEmail);

router.put("/updateReport/:id", reportController.updateReport);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/:id', upload.array('image', 2), reportController.createReport);

module.exports = router;

