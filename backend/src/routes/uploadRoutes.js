import express from 'express';
import { uploadImage, upload } from '../controllers/uploadController.js';

const router = express.Router();

router.post('/', upload.single('image'), uploadImage);

export default router;
