const sharp = require("sharp");
const fs = require("fs");

// Compressing the image
function imageCompress(path) {
  sharp(path)
    .resize(800) // Resize the image to 800px width (maintaining aspect ratio)
    .jpeg({ quality: 20 }) // Compress the image to 80% quality
    .toFile("../compressed/outputImagePath.jpg", (err, info) => {
      if (err) {
        console.error("Error compressing the image:", err);
      } else {
        console.log("Image successfully compressed:", info);
      }
    });
}

imageCompress("../uploads/test.jpg");

// module.exports = imageCompress;
