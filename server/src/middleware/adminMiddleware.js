const adminOnly = (req, res, next) => {
  // protect middleware should already
  // authenticate the user before this middleware.
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  // Only admin users are allowed.
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required.",
    });
  }

  next();
};

module.exports = {
  adminOnly,
};