const express = require("express");
const router = express.Router();
// const controlPanelType = require("../Controllers/panelType.controllers");

router.get("/", (req, res) => {
  res.render("controlPoint/point");
});

router.get("/submap", (req, res) => {
  res.render("controlPoint/submap", { layout: false });
});

router.get("/:id", (req, res) => {
  res.render("controlPoint/detail");
});

module.exports = router;
