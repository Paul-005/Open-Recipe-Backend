const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

// Initialize the app
const app = express();

app.use(cors({ origin: "*" }));

// Set up storage engine
const storage = multer.diskStorage({
  destination: "./uploads/", // Directory to save the uploaded files
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("myFile"); // 'myFile' should match the form field name in the client

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

// Route to upload file and receive text data
app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }
    if (req.file == undefined) {
      return res.status(400).json({ message: "No file selected!" });
    }
    const { textData } = req.body; // Retrieve the text data
    res.json({
      message: "File uploaded successfully!",
      file: `uploads/${req.file.filename}`,
      textData: textData, // Send the text data back in the response
    });
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
