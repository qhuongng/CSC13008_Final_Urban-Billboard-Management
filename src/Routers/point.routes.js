const express = require("express");
const router = express.Router();
const pointController = require("../Controllers/point.controllers");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post("/uploadPoint", upload.single('image'), pointController.createPoint);
router.get("/getAllPoint", pointController.getAllPoint);
router.get("/getPoint/:id", pointController.getPointById);
router.delete("/deletePoint/:id", pointController.deletePoint);
router.put("/updatePoint/:id", pointController.updatePoint);

router.get('/getPointByDis/:name', pointController.getPointByDis)
router.get('/getPointByWardAndDis/:wardName/:districtName', pointController.getPointByWardAndDis);

module.exports = router;
