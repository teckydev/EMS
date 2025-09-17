const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // req.user is set by the `protect` middleware
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = { authorizeRoles };