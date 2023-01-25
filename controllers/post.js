const Post = require("../models/post");
const User = require("../models/user");

const createPost = async (req, res) => {
  try {
    const newPostData = {
      caption: req.body.caption,
      image: {
        public_id: "req.body.public_id",
        url: "req.body.url",
      },
      owner: req.user._id,
    };

    const post = await Post.create(newPostData);

    const user = await User.findById(req.user._id);

    // Pushing the post id to show on the User schema
    user.posts.push(post._id);

    // Always save
    await user.save();

    res.status(201).json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const likeandUnlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(400).json({ success: false, msg: "Post not found" });
    }

    // If the likes include the user's id that user can unlike by using the splice method
    if (post.likes.includes(req.user._id)) {
      const index = post.likes.indexOf(req.user._id);

      post.likes.splice(index, 1);

      await post.save();

      return res.status(200).json({
        success: true,
        msg: "Unliked Post",
      });
    } else {
      // You are pushing the user id to the post array in the post schema to show the list of users that liked post
      post.likes.push(req.user._id);

      await post.save();

      return res.status(200).json({
        success: true,
        msg: "Liked Post",
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, msg: "Post not found" });
    }

    // If its not the user that owns the post that wants to delete...don't authorize
    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    // else authorize
    await post.remove();

    // This is to show that the posts array in the User schema has been deleted
    const user = await User.findById(req.user._id);

    const index = user.posts.indexOf(req.params.id);

    user.posts.splice(index, 1);

    await user.save();

    res.status(200).json({ success: true, msg: "Post deleted" });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const getfollowedTimelinePosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const posts = await Post.find({
      owner: {
        $in: user.following,
      },
    });
    res.status(200).json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const updateCaption = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404).json({ success: false, msg: "Post not found" });
    }

    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    post.caption = req.body.caption;

    await post.save();

    res.status(200).json({ success: true, msg: "Caption has been updated" });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const commentOnPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, msg: "Post not found" });
    }

    let commentIndex = -1;

    post.comments.forEach((item, index) => {
      if (item.user.toString() === req.user._id.toString()) {
        commentIndex = index;
      }
    });

    if (commentIndex !== -1) {
      post.comments[commentIndex].comment = req.body.comment;

      await post.save();

      return res.status(200).json({ success: true, msg: "Comment updated" });
    } else {
      post.comments.push({
        user: req.user._id,
        comment: req.body.comment,
      });

      await post.save();
      return res.status(200).json({ success: true, msg: "Comment added" });
    }
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

module.exports = {
  createPost,
  likeandUnlikePost,
  deletePost,
  getfollowedTimelinePosts,
  updateCaption,
  commentOnPost,
};
