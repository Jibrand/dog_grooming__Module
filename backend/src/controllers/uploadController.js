import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import streamifier from 'streamifier';

// The credentials should be picked up from process.env if they match standard CLOUDINARY_URL or are manually configured here.
// Assuming the user has set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET or similar in .env
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'clinic_logos',
      },
      (error, result) => {
        if (error) {
          return next(error);
        }
        res.status(200).json({ success: true, url: result.secure_url });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

  } catch (error) {
    next(error);
  }
};
