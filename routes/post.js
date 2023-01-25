const express = require("express");
const authenticateUser = require("../middleware/auth");

const router = express.Router();

const {
  createPost,
  likeandUnlikePost,
  deletePost,
  getfollowedTimelinePosts,
  updateCaption,
  commentOnPost,
} = require("../controllers/post");

router
  .route("/")
  .get(authenticateUser, getfollowedTimelinePosts)
  .post(authenticateUser, createPost);

router
  .route("/:id")
  .get(authenticateUser, likeandUnlikePost)
  .patch(authenticateUser, updateCaption)
  .delete(authenticateUser, deletePost);

router.patch("/comment/:id", authenticateUser, commentOnPost);
module.exports = router;
