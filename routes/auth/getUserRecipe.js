const { Router } = require("express");
const verifyUser = require("./jwtVerifier");
const jwt = require("jsonwebtoken");
const RecipeModal = require("../../modals/RecipeModal");

const route = Router();

const getUsersRecipe = route.get(
  "/get-users-recipe",
  verifyUser,
  async (req, res) => {
    if (req.headers.token) {
      var token = req.headers.token;
    }
    try {
      const decoded = jwt.decode(token);
      const getRecipe = await RecipeModal.find({ email: decoded });
      res.json(getRecipe);
    } catch (error) {
      res.json({ err: error.message });
    }
  }
);

module.exports = getUsersRecipe;
