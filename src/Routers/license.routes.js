const express = require('express');
const router = express.Router()
const licenseController = require('../Controllers/license.controllers')
const multer = require('multer');

router.post('/createLicense', licenseController.createLicense);
router.get('/getAllLicense', licenseController.getAllLicense);
router.get('/getLicenseByIdPanel', licenseController.getAcceptedLicenseByIdPanel);
router.put('/udpateAccept', licenseController.updateAccept);

module.exports = router;