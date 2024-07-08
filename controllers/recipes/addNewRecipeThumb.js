/* eslint-disable no-undef */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

  // Create necessary directories if they don't exist
  if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
    fs.mkdirSync(path.join(__dirname, 'uploads'));
  }
  if (!fs.existsSync(path.join(__dirname, 'compressed'))) {
    fs.mkdirSync(path.join(__dirname, 'compressed'));
  }

// Endpoint for file upload
// app.post('/upload', async (req, res) => {
    
const addNewRecipeThumb = async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send({ error: 'No files were uploaded.' });
    }
  
    const image = req.files.image;
    const uploadPath = path.join(__dirname, 'uploads', image.name);
  
    // Save the file to the uploads directory
    image.mv(uploadPath, async (err) => {
      if (err) {
        return res.status(500).send({ error: 'Error saving the file.' });
      }
  
      const compressedFilePath = path.join(__dirname, 'compressed', `${Date.now()}-${image.name}`);
  
      try {
        // Compress the image using Sharp
        await sharp(uploadPath)
          .resize({ width: 500 }) // Adjust width as needed
          .jpeg({ quality: 80 }) // Adjust quality as needed to get close to 50KB
          .toFile(compressedFilePath);
  
        // Optionally delete the original file
        fs.unlinkSync(uploadPath);
  
        res.status(200).send({ message: 'File uploaded and compressed successfully', file: compressedFilePath });
      } catch (error) {
        res.status(500).send({ error: 'Error processing the file' });
      }
    });
  };
  


  module.exports = addNewRecipeThumb;