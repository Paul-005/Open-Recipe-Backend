const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");

//file imports
const UserModal = require("../../modals/UserModal");

const route = express.Router();

const createToken = (user) => {
  return jwt.sign(user, "panoca_secret");
};

const JioValSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(6).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  name: Joi.string().min(5)
});

const CreateAccount = route.post("/signup", async (req, res) => {
  const user = req.body;

  try {
    await JioValSchema.validateAsync({
      email: user.email,
      password: user.password,
      name: user.name
    });

    bcrypt.hash(user.password, 10, function (err, hash) {
      // Store hash in your password DB.
      if (err) return res.send("Error while hashing password", err);
      saveUsertoDB(user.email, hash, user.name);
    });
  } catch (err) {
    res.json({ err: err.details[0].message });
    res.end();
  }

  const saveUsertoDB = (email, hashPwd, name) => {
    var userToDB = {
      email,
      password: hashPwd,
      name
    };

    const UserData = new UserModal(userToDB);

    UserData.save()
      .then(({ email, name }) => {
        console.log("created Account");
        const token = createToken(user.email);
        res.json({ token, email, name });
      })
      .catch((err) => {
        if (err.code === 11000)
          res.json({
            error_code: err.code,
            err: "This Account already taken."
          });
      });
  };
});

const LoginAccount = route.post("/login", (req, res) => {
  if (req.body === "undefined") {
    res.json({ error: "Enter a valid Email and Password" });
  }

  var { email, password } = req.body;

  UserModal.findOne({ email })
    .then((res) => {
      pwdCompare(res.password, res);
    })
    .catch(() => {
      res.json({ err: "User not found. Try to register" });
    });

  const pwdCompare = (dbpassword, user) => {
    bcrypt.compare(password, dbpassword, function (err, result) {
      if (result) {
        const token = createToken(user.email);
        const { name, email } = user;
        res.json({
          message: "Successfully logged in",
          token,
          user: {
            name,
            email
          }
        });
      } else {
        return res.json({ err: "Incorrect password" });
      }
    });
  };
});

module.exports = { CreateAccount, LoginAccount };
