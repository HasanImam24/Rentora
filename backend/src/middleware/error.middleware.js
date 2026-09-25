import { sendError } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors = null;

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors).map(val => val.message);
  } else if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
    errors = Object.keys(err.keyValue);
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your token has expired. Please log in again.';
  } else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.message) {
    message = err.message;
  }

  sendError(res, statusCode, message, errors);
};
