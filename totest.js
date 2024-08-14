const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();

const upload = multer({ dest: 'uploads/' });

app.use(cors());

app.get('/', (req, res) => res.json({name: "nmeee"}))

app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file);
  console.log(req.body);
  res.json({ message: 'File and data received' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
