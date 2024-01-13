const express = require('express');
const router = express.Router()
const reportTypeController = require('../Controllers/reportType.controllers');

router.post('/createTypeReport', reportTypeController.createTypeReport);
router.get('/getAllReportType', reportTypeController.getAllReportType);
router.put('/updateReportType', reportTypeController.updateReportType);
router.delete('/deleteReportType', reportTypeController.deleteReportType);

module.exports = router