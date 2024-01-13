const express = require('express');
const router = express.Router()
const wardController = require('../Controllers/ward.controllers');

router.post('/createWard', wardController.createWard);
router.put("/update-ward/:id", wardController.updateWard);
router.delete("/delete-ward/:id", wardController.deleteWard);

router.get("/getAll-ward", wardController.getAllWard);
router.get("/getDetail-ward/:id", wardController.getDetailWard);

router.get("/getWard/:name", wardController.getWardsByDistrictName);

module.exports = router