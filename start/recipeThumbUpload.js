const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, "uploaded_thumbnail.jpg");
  },
});


function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg/;
  const extname = filetypes.test(path.extname("uploaded_thumbnail.jpg").toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Error: Images Only!"), false);
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Increased to 5MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("FoodImg")

module.exports = upload;
