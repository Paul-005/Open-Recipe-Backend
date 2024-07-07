const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserModal = require("../../modals/UserModal");

const loginUser = (req, res) => {
  if (req.body === "undefined") {
    res.json({ error: "Enter a valid Email and Password" });
  }

  var { email, password } = req.body;

  UserModal.findOne({ email })
    .then((res) => pwdCompare(res.password, res))
    .catch(() => res.json({ err: "User not found. Try to register" }));

  const pwdCompare = (hashedpassword, user) => {
    bcrypt.compare(password, hashedpassword, function (err, result) {
      if (result) {
        const token = jwt.sign(user.email, "panoca_secret");
        const { name, email } = user;
        res.status(200).json({
          message: "Successfully logged in",
          token,
          user: {
            name,
            email,
          },
        });
      } else return res.json({ err: "Incorrect password" });
    });
  };
};

module.exports = loginUser;
