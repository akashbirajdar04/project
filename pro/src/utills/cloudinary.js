import cloudinary from 'cloudinary';
import streamifier from 'streamifier';
import dotenv from 'dotenv';
import path from 'path';

// Explicitly load .env from project root
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

export const uploadBufferToCloudinary = (buffer, options = {}) => {
    return new Promise((resolve, reject) => {
        // Configure Cloudinary just before upload to ensure env vars are loaded
        cloudinary.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        const uploadStream = cloudinary.v2.uploader.upload_stream(
            options,
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};
