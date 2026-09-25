import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { config } from '../config/environment.js';

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expire
  });
};

export const register = async ({ name, email, phone, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw { statusCode: 400, message: 'User already exists with this email' };
  }

  const salt = await bcryptjs.genSalt(12);
  const passwordHash = await bcryptjs.hash(password, salt);

  const user = await User.create({
    name,
    email,
    phone,
    passwordHash
  });

  const token = generateToken(user._id);
  const userResponse = user.toObject();
  delete userResponse.passwordHash;

  return { user: userResponse, token };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw { statusCode: 401, message: 'Invalid credentials' };
  }

  if (!user.isActive) {
    throw { statusCode: 401, message: 'Account is deactivated' };
  }

  const isMatch = await bcryptjs.compare(password, user.passwordHash);
  if (!isMatch) {
    throw { statusCode: 401, message: 'Invalid credentials' };
  }

  const token = generateToken(user._id);
  const userResponse = user.toObject();
  delete userResponse.passwordHash;

  return { user: userResponse, token };
};
