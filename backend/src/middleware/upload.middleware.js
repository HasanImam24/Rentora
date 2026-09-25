import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const storage = multer.memoryStorage();
export const uploadImages = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).array('images', 5);

export const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    uploadStream.end(buffer);
  });
};
