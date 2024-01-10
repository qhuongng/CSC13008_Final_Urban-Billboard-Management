
const express = require("express");
const router = express.Router();
const userController = require("../Controllers/user.controllers");

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);

router.put("/update-user/:id", userController.updateUser);
router.delete("/delete-user/:id", userController.deleteUser);

router.get("/getAll-user", userController.getAllUser);

router.get("/getDetails-user/:id", userController.getDetailsUser);

router.get("/login", (req, res) => {
  res.render("viewUser/login", {
    layout: false
  });
});
router.get('/resetPassword', (req, res) => {
  res.render("viewUser/resetPassword", {
    layout: false
  });
})

module.exports = router;
