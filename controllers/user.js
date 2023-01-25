const User = require("../models/user");
const Post = require("../models/post");

const getUser = async (req, res) => {
  try {
    const user = await (await User.findById(req.params.id)).populate("posts");

    if (!user) {
      res.status(404).json({ success: false, msg: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const user = await User.find({})
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const followandUnfollowUser = async (req, res) => {
  try {
    // Follow user by its id
    const userToFollow = await User.findById(req.params.id);
    // The user logged in can see followers
    const loggedInUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    if (loggedInUser.following.includes(userToFollow._id)) {
      const indexFollowing = loggedInUser.following.indexOf(userToFollow._id);
      const indexFollowers = userToFollow.following.indexOf(userToFollow._id);

      loggedInUser.following.splice(indexFollowing, 1);
      userToFollow.followers.splice(indexFollowing, 1);

      await loggedInUser.save();
      await userToFollow.save();

      res.status(200).json({
        success: true,
        msg: `You have unfollowed ${userToFollow.name}`,
      });
    } else {
      // Show to the logged in user the user id its following in the user schema
      loggedInUser.following.push(userToFollow._id);
      // Show the user that has been followed his followers array which would be the id of the user following him
      userToFollow.followers.push(loggedInUser._id);

      await loggedInUser.save();
      await userToFollow.save();

      res
        .status(200)
        .json({ success: true, msg: `You are following ${userToFollow.name}` });
    }
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const { name, email } = req.body;

    if (name) {
      user.name = name;
    }

    if (email) {
      user.email = email;
    }

    await user.save();

    res.status(200).json({ success: true, msg: "Profile Update Success" });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const posts = user.posts;
    const followers = user.followers;
    const following = user.following;
    const userId = user._id;

    await user.remove();

    // Remove the user following
    for (let i = 0; i < followers.length; i++) {
      const follower = await User.findById(followers[i]);

      const index = follower.following.indexOf(userId);
      follower.following.splice(index, 1);
      await follower.save();
    }

    // Remove the user followers
    for (let i = 0; i < following.length; i++) {
      const followings = await User.findById(following[i]);

      const index = followings.followers.indexOf(userId);
      followings.followers.splice(index, 1);
      await followings.save();
    }

    // Log Out User after deleting profile
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    // Remove all posts from user
    for (let i = 0; i < posts.length; i++) {
      const post = await Post.findById(posts[i]);
      await post.remove();
    }

    res.status(200).json({
      success: true,
      msg: "Account Deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  followandUnfollowUser,
  updateProfile,
  deleteAccount,
};
