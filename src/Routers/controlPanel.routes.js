const express = require("express");
const router = express.Router();
const controlPanelType = require("../Controllers/panel.controllers");

router.get("/", (req, res) => {
  res.render("controlPanel/controlPanel");
});

router.get("/submap", (req, res) => {
  res.render("controlPanel/submap", {
    layout: false
  });
});


module.exports = router;
