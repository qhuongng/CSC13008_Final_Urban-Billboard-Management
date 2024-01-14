const express = require("express");
const router = express.Router();
const pointController = require("../Controllers/point.controllers");

router.post("/uploadPoint", pointController.createPoint);
router.get("/getAllPoint", pointController.getAllPoint);
router.delete("/deletePoint/:id", pointController.deletePoint);
router.put("/updatePoint/:id", pointController.updatePoint);

router.get('/getPointByDis/:name', pointController.getPointByDis)
router.get('/getPointByWardAndDis/:wardName/:districtName', pointController.getPointByWardAndDis);

module.exports = router;
