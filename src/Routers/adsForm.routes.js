const express = require("express");
const router = express.Router();
const adsFormController = require("../Controllers/adsForm.controllers");

router.post("/createForm", adsFormController.createForm);
router.get("/getAllForm", adsFormController.getAllForm);
module.exports = router;
