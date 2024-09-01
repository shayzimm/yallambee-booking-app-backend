import express from 'express';
import cloudinary from '../config/cloudinaryConfig.js'; 
import upload from '../config/multerConfig.js'; 

const router = express.Router();

// Route to handle image upload
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        // Uploading the file to Cloudinary using upload_stream for in-memory files
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
            uploadStream.end(req.file.buffer); // Use buffer for in-memory storage
        });

        // Responding with the necessary details
        res.json({
            success: true,
            message: 'File uploaded successfully.',
            file: {
                filename: req.file.originalname,
                // URL of the uploaded image
                path: result.secure_url,
                // Size of the file in bytes
                size: req.file.size
            }
        });
    } catch (error) {
        console.error('Upload failed:', error);
        res.status(500).json({ success: false, message: 'Upload failed' });
    }
});

// Test route to verify multer setup
router.post('/test-upload', upload.single('image'), (req, res) => {
    console.log(req.file); // Should log the file object if upload is working
    res.send('Upload test complete');
});

export default router;
