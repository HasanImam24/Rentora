import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { config } from '../config/environment.js';
import { sendError } from '../utils/response.js';

export const authenticate = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return sendError(res, 401, 'Not authorized to access this route');
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return sendError(res, 401, 'User associated with this token no longer exists');
    }
    
    if (!user.isActive) {
      return sendError(res, 401, 'Your account has been deactivated');
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 401, 'Not authorized to access this route');
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(res, 403, `User role ${req.user.role} is not authorized to access this route`);
    }
    next();
  };
};
