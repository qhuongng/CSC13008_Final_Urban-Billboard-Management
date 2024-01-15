const express = require('express');
const router = express.Router()
const licenseController = require('../Controllers/license.controllers')
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// /api/license/?point={địa chỉ}&panel={hình thức (id)}
router.get('/', (req, res) => {
    res.render('viewLicense/licenseForm', { point: req.query.point, panel: req.query.panel });
});


router.post('/', upload.single('image'), licenseController.createLicense);
router.get('/getAllLicense', licenseController.getAllLicense);
router.get('/getLicenseByIdPanel/:id', licenseController.getAcceptedLicenseByIdPanel);
router.get('/getLicenseByWardDis/:wardName/:districtName', licenseController.getLicenseByWardDis)
router.get('/getLicenseByDis/:districtName', licenseController.getLicenseByDis)
router.put('/udpateAccept', licenseController.updateAccept);
router.delete('/deleteLicense/:id', licenseController.deleteLicense);

module.exports = router;