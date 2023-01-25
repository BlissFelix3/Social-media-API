const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/auth");

const {
  getAllUsers,
  getUser,
  followandUnfollowUser,
  updateProfile,
  deleteAccount,
} = require("../controllers/user");

router.get("/follow/:id", authenticateUser, followandUnfollowUser);

router.patch("/update-profile", authenticateUser, updateProfile);

router.delete("/delete-account", authenticateUser, deleteAccount);

router.get('/', authenticateUser, getAllUsers)

router.get("/:id", authenticateUser, getUser);

module.exports = router;
