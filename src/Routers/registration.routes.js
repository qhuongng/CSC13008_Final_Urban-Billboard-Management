const express = require("express");
const router = express.Router();
// const controlPanelType = require("../Controllers/panelType.controllers");

router.get("/", (req, res) => {
  res.render("Registration/accounts");
});

router.get("/add", (req, res) => {
  res.render("Registration/registration");
});


router.post("/", (req, res) => {
  const { name, email, date, password, phone, role } = req.body;
  console.log(name, email, date, password, phone, role);
  try {
    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
