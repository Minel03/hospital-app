import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'; // Your user model

// Middleware to protect routes
export const authMiddleware = async (req, res, next) => {
  let token;

  // Get token from headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request
      req.user = await User.findById(decoded.id).select('-password'); // remove password

      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: 'User not found' });
      }

      next();
    } catch (error) {
      console.log(error);
      return res
        .status(401)
        .json({ success: false, message: 'Not authorized, token failed' });
    }
  } else {
    return res
      .status(401)
      .json({ success: false, message: 'Not authorized, no token' });
  }
};
