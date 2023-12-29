const express = require('express');
const router = express.Router()
const districtController = require('../Controllers/district.controllers');

router.post('/createDistrict', districtController.createDistrict),

module.exports = router