import { uploadBufferToCloudinary } from "../utills/cloudinary.js";
import { User } from "../models/user.module.js";

export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const userId = req.params.id; // Assuming ID is passed in params
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const result = await uploadBufferToCloudinary(req.file.buffer, { folder: 'hostel_profiles' });

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    "avatar.url": result.secure_url,
                    "avatar.public_id": result.public_id
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            message: "Image uploaded successfully",
            data: {
                url: updatedUser.avatar.url,
                public_id: updatedUser.avatar.public_id
            }
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: 'Upload failed', details: error.message });
    }
};
