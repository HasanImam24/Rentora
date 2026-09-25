import * as authService from '../services/auth.service.js';
import { sendSuccess } from '../utils/response.js';

export const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.register(req.body);
    // Setting token in cookie is optional but good practice
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    sendSuccess(res, 201, 'User registered successfully', { user, token });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { user, token } = await authService.login(req.body);
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    sendSuccess(res, 200, 'Login successful', { user, token });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    sendSuccess(res, 200, 'User profile retrieved successfully', { user: req.user });
  } catch (error) {
    next(error);
  }
};
