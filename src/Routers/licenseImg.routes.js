const express = require('express');
const router = express.Router()
const licenseImgController = require('../Controllers/licenseImg.controllers');

router.get('/getImgReport/:id', licenseImgController.getImgLicense);

module.exports = router