const express = require("express");
const jwt = require("jsonwebtoken");
const verifyUser = require("./auth/jwtVerifier");

const route = express.Router();

module.exports = route.get("/home", verifyUser, (req, res) => {
  res.send("authiticated successfully");
  var user = req.headers.token;
  console.log(user);
});

// var Content = route.post("/content-edit", verifyUser, (req, res) => {
//   console.log(req.body);
// });
