const express = require("express");
const router = express.Router();
const pointController = require("../Controllers/point.controllers");

router.post("/uploadPoint", pointController.createPoint);
router.get("/getAllPoint", pointController.getAllPoint);
router.get("/getPoint/:id", pointController.getPointById);
router.delete("/deletePoint/:id", pointController.deletePoint);
router.put("/updatePoint/:id", pointController.updatePoint);

module.exports = router;
