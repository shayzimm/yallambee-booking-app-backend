import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';


// Loading environment variables from .env file
dotenv.config();

// Configuration of Cloudinary
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
});
    
console.log('Cloudinary configuration set successfully.');

// Uploading an image functionality
(async function() {
    try {
        const uploadResult = await cloudinary.uploader.upload(
            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
                public_id: 'shoes',
            }
        );
        
        console.log('Upload Result:', uploadResult);

        // Optimize delivery by resizing and applying auto-format and auto-quality
        const optimizeUrl = cloudinary.url('shoes', {
            fetch_format: 'auto',
            quality: 'auto'
        });
        
        console.log('Optimized URL:', optimizeUrl);

        // Transform the image: auto-crop to square aspect_ratio
        const autoCropUrl = cloudinary.url('shoes', {
            crop: 'auto',
            gravity: 'auto',
            width: 500,
            height: 500,
        });
        
        console.log('Auto-Cropped URL:', autoCropUrl);
    } catch (error) {
        console.error('Error:', error);
    }
})();

export default cloudinary;