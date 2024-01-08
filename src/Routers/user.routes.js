
const express = require("express");
const router = express.Router();
const userController = require("../Controllers/user.controllers");

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);

router.put("/update-user/:id", userController.updateUser);
router.delete("/delete-user/:id", userController.deleteUser);

router.get("/getAll-user", userController.getAllUser);

router.get("/getDetails-user/:id", userController.getDetailsUser);

router.get("/login", (req, res) => {
  res.render("login", {
    //Partials: false
  });
});

module.exports = router;
