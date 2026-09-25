import { sendError } from '../utils/response.js';

export const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    sendError(res, 403, 'Access denied. Admin resources only.');
  }
};
