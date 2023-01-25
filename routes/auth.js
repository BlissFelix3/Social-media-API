const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/auth");

const {
  register,
  login,
  logout,
  updatePassword,
} = require("../controllers/auth");


router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.patch("/update-password", authenticateUser, updatePassword);

module.exports = router;
