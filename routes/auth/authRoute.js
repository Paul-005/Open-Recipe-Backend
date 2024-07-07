const express = require("express");

const loginUser = require("../../controllers/authentication/loginUser");
const regsiterUser = require("../../controllers/authentication/registerUser");
const deleteUser = require("../../controllers/authentication/deleteUser");
const verifyUser = require("../../middlewares/jwtVerifier");
const getUsersProfile = require("../../controllers/authentication/userProfile");

const router = express.Router();

router.post("/signup", regsiterUser);
router.post("/login", loginUser);
router.post("/deleteAccount", verifyUser, deleteUser);
router.get("/get-users-recipe", verifyUser, getUsersProfile);

module.exports = router;
