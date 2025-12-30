const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  if (!req.headers.authorization?.startsWith("Bearer")) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch {
    res.status(401).json({ message: "Not authorized" });
  }
};
