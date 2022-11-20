const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
  var token = req.headers.token;

  if (token === undefined) return res.json({ error: "Not Authenticated" });

  jwt.verify(token, "panoca_secret", function (err, decoded) {
    try {
      if (err) {
        res.json({ error: err.message });
      } else {
        console.log(decoded);
        next();
      }
    } catch (error) {
      res.json({ error: error.message });
    }
  });
};

module.exports = verifyUser;
