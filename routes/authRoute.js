const express = require("express");

const loginUser = require("../controllers/authentication/loginUser");
const regsiterUser = require("../controllers/authentication/registerUser");
const deleteUser = require("../controllers/authentication/deleteUser");
const verifyUser = require("../middlewares/jwtVerifier");
const getUsersProfile = require("../controllers/authentication/userProfile");

const authRoute = express.Router();

authRoute.post("/signup", regsiterUser);
authRoute.post("/login", loginUser);
authRoute.post("/deleteAccount", verifyUser, deleteUser);
authRoute.get("/get-users-recipe", verifyUser, getUsersProfile);

module.exports = authRoute;
