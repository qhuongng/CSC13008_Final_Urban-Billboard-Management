const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("Controls/reportType/reportType");
});

module.exports = router;
