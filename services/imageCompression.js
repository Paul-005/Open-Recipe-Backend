const sharp = require("sharp");
const fs = require("fs");

// Compressing the image
function imageCompress(name, compressedFilename) {
  sharp(name)
    .resize(800) // Resize the image to 800px width (maintaining aspect ratio)
    .jpeg({ quality: 20 }) // Compress the image to 80% quality
    .toFile(`uploads/${compressedFilename}`, (err, info) => {
      if (err) {
        console.error("Error compressing the image:", err);
      } else {
        console.log("Image successfully compressed:", info);
      }
    });
}


module.exports = imageCompress;
