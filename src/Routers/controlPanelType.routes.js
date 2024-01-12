const express = require("express");
const router = express.Router();
const controlPanelType = require("../Controllers/panelType.controllers");

router.get("/", (req, res) => {
  res.render("controlPanelType/panelType");
});

router.put("/edit", controlPanelType.updatePanelType);

module.exports = router;
