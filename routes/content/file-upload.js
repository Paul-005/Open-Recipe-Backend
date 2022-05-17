const { Router } = require("express");

const route = Router();

const upload = route.post("/upload", (req, res) => {
  res.json(req);
  if (req.files === null) return res.json({ msg: "No file uploaded" });

  const file = req.files.file;

  file.mv(`${__dirname}/uploads/${file.name}`, (err) => {
    if (err) {
      console.error(err);
      return res.send(err);
    }

    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});

module.exports = upload;
