const multer = require("multer");
const path = require("path");


// Set up storage engine
const storage = multer.diskStorage({
    destination: './uploads/', // Directory to save the uploaded files
    filename: function (req, file, cb) {
        // Create a unique name for the file by appending the current timestamp
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });


// Initialize upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // Limit file size to 1MB
  fileFilter: function (req, file, cb) {
    // Filter files by type, e.g., only images
    checkFileType(file, cb);
  },
}).single("recipeThumbnail"); // 'myFile' should match the form field name in the client

// Check file type
function checkFileType(file, cb) {
  // Allowed file types
  const filetypes = /jpeg|jpg|png|gif/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

const recipeThumbnail = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).json({ message: err });
    } else {
      if (req.file == undefined) {
        res.status(400).json({ message: "No file selected!" });
      } else {
        res.json({
          message: "File uploaded successfully!",
          file: `uploads/${req.file.filename}`,
        });
      }
    }
  });
};

module.exports = recipeThumbnail;

