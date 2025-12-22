const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, token missing' });
    }

    const token = req.headers.authorization.split(' ')[1];

    // Verify the token with an explicit algorithm check for security
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256']
    });
// ✅ Add this line to inspect the decoded token
    // Attach decoded user info to the request for the next middleware to use
      // Attach decoded info
    req.user = {
      userId: decoded.id,  // ✅ Must match the _id of the User model
      role: decoded.role
    };
    // req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { protect };