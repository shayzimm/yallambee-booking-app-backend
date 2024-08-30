import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Getting the current directory of the module (trying to debug the path config)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// setting path to uploads directory
const uploadDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Uploads directory created.');
} else {
    console.log('Uploads directory already exists.');
}

// Defining the storage location and filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Ensuring unique filenames
  }
});

// Initilsing multer with the storage configuration
const upload = multer({ storage: storage });

export default upload;