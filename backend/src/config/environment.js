import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/rentbuy',
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret',
    expire: process.env.JWT_EXPIRE || '7d',
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  adminEmail: process.env.ADMIN_EMAIL || 'admin@rentbuy.com',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
};
