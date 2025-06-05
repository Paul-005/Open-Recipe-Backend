const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Create uploads directory if it doesn't exist
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `recipe-${uniqueSuffix}${ext}`);
  },
});

// File type validation
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files (JPEG, JPG, PNG, WebP) are allowed!"), false);
  }
}

// Configure multer upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
  },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("recipeThumbnail");

// Compress image
async function compressImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .resize(800) // Resize to 800px width
      .jpeg({ quality: 80 }) // Compress to 80% quality
      .toFile(outputPath);
    return true;
  } catch (error) {
    console.error("Error compressing image:", error);
    return false;
  }
}

// Upload to Cloudinary
async function uploadToCloudinary(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "recipe-thumbnails",
      resource_type: "image",
    });
    return result;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
}

// Clean up temporary files
function cleanupTempFiles(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("Error cleaning up temporary file:", error);
  }
}

// Main upload handler
const handleImageUpload = async (req, res) => {
  return new Promise((resolve, reject) => {
    upload(req, res, async (err) => {
      if (err) {
        return reject(err);
      }

      if (!req.file) {
        return reject(new Error("No file selected!"));
      }

      try {
        // Compress the image
        const compressedPath = `${uploadDir}compressed-${req.file.filename}`;
        const compressionSuccess = await compressImage(req.file.path, compressedPath);

        if (!compressionSuccess) {
          throw new Error("Failed to compress image");
        }

        // Upload to Cloudinary
        const uploadResult = await uploadToCloudinary(compressedPath);

        // Clean up temporary files
        cleanupTempFiles(req.file.path);
        cleanupTempFiles(compressedPath);

        resolve(uploadResult);
      } catch (error) {
        // Clean up on error
        if (req.file) {
          cleanupTempFiles(req.file.path);
        }
        reject(error);
      }
    });
  });
};

module.exports = {
  handleImageUpload,
  upload,
}; 