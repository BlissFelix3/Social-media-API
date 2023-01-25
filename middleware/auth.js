const User = require("../models/user");
const jwt = require("jsonwebtoken");

const authenticateUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.status(401).json({ msg: "Please login first" });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.userId);

    next();
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = authenticateUser;
