const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
  if (req.headers.token) {
    var token = req.headers.token;
  }

  if (token === undefined) res.redirect("/login");

  jwt.verify(token, "panoca_secret", function (err, decoded) {
    try {
      if (err) {
        res.redirect("/login");
        res.json({ msg: "Not autheicated" });
        // console.log(err);
      }
      console.log(decoded);

      next();
    } catch (error) {
      console.log(error.message);
    }
  });
};

module.exports = verifyUser;
