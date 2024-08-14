const express = require('express');
const multer = require('multer');
const path = require('path');

const cors = require("cors");


// Initialize the app
const app = express();

app.use(cors({ origin: "*" }));
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
    limits: { fileSize: 1000000 }, // Limit file size to 1MB
    fileFilter: function (req, file, cb) {
        // Filter files by type, e.g., only images
        checkFileType(file, cb);
    }
}).single('myFile'); // 'myFile' should match the form field name in the client

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
        cb('Error: Images Only!');
    }
}


app.get('/upload-file', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

// Route to upload file
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).json({ message: err });
        } else {
            if (req.file == undefined) {
                res.status(400).json({ message: 'No file selected!' });
            } else {
                res.json({
                    message: 'File uploaded successfully!',
                    file: `uploads/${req.file.filename}`
                });
            }
        }
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
