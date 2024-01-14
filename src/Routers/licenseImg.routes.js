const express = require('express');
const router = express.Router()
const licenseImgController = require('../Controllers/licenseImg.controllers');

router.get('/getImgLicense/:id', licenseImgController.getImgLicense);

module.exports = router