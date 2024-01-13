const express = require("express");
const router = express.Router();
// const controlPanelType = require("../Controllers/panelType.controllers");

router.get("/", (req, res) => {
  res.render("controlPoint/point");
});

module.exports = router;
