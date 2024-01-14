const express = require('express');
const router = express.Router()
const licenseController = require('../Controllers/license.controllers')
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', (req, res) => {
    res.render('viewLicense/licenseForm');
});

router.post('/createLicense', upload.single('image'), licenseController.createLicense);
router.get('/getAllLicense', licenseController.getAllLicense);
router.get('/getLicenseByIdPanel', licenseController.getAcceptedLicenseByIdPanel);
router.put('/udpateAccept', licenseController.updateAccept);

module.exports = router;