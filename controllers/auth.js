const User = require("../models/user");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ success: false, msg: "User already exists" });
    }

    user = await User.create({
      name,
      email,
      password,
      avatar: { public_id: "sample_id", url: "sampleurl" },
    });

    const token = await user.generateToken();

    const oneDay = 1000 * 60 * 60 * 24;

    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
      })
      .json({ success: true, user, token });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, msg: "Please enter email and password" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "User does not exist" });
    }

    const validPassword = await user.comparePassword(password);

    if (!validPassword) {
      return res.status(400).json({ success: false, msg: "Invalid Password" });
    }

    const token = await user.generateToken();

    const oneDay = 1000 * 60 * 60 * 24;

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
      })
      .json({ success: true, user, token });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
      .json({ success: true, msg: "You have sucessfully logged out" });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      res
        .status(400)
        .json({
          success: false,
          msg: "Please enter old password and new password",
        });
    }

    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, msg: "Incorrect old password" });
    }

    user.password = newPassword;

    await user.save();

    res
      .status(200)
      .json({ success: true, msg: "Password has been sucessfully updated" });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

module.exports = { register, login, logout, updatePassword };
