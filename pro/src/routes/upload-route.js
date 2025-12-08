import express from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/upload-controller.js';
import { validateObjectId } from "../validators/common-validators.js";
import { validateuser } from "../middleware/validate.middle.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route for generic upload, can be used for hostel profile image
router.put('/hostel/:id/profile/image', validateObjectId("id"), validateuser, upload.single('image'), uploadImage);
router.put('/mess/:id/profile/image', validateObjectId("id"), validateuser, upload.single('image'), uploadImage);

export default router;
