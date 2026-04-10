import jwt from 'jsonwebtoken';

export const authUser = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not Authorized. Login again.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach full user info (id, role, etc.)
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Middleware to restrict access based on roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // req.user is populated by authUser middleware
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};

export default authUser;
