const express = require('express');
const router = express.Router()
const districtController = require('../Controllers/district.controllers');

router.post('/createDistrict', districtController.createDistrict),
router.put("/update-district/:id", districtController.updateDistrict);
router.delete("/delete-district/:id", districtController.deleteDistrict);

router.get("/getAll-dis", districtController.getAllDis);

module.exports = router