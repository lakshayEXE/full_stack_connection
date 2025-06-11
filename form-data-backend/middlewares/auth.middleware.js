const jwt = require('jsonwebtoken');
const JWT_SECRET = 'mERi_key'; // Consider using process.env.JWT_SECRET for production

module.exports = (req, res, next) => {
  const header = req.headers.authorization;

  // Check if header exists and follows "Bearer <token>" format
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided or format invalid' });
  }

  const token = header.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Attach user info to request object
    req.user = decoded;

    // Move to the protected route
    next();
  });
};
