const express = require("express");

const verifyUser = require("../middlewares/jwtVerifier");
const recipeControllers = require("../controllers/recipeControllers");

const recipesRoute = express.Router();

// Base route for recipes
recipesRoute.get("/", recipeControllers.fetchAllRecipes);
recipesRoute.get("/:id", verifyUser, recipeControllers.fetchRecipeById);
recipesRoute.post("/new", verifyUser, recipeControllers.addNewRecipe);
recipesRoute.delete("/:id", verifyUser, recipeControllers.deleteRecipe);

module.exports = recipesRoute;
