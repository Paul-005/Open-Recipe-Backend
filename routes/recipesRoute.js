const express = require("express");

const verifyUser = require("../middlewares/jwtVerifier");
const recipeById = require("../controllers/recipes/fetchRecipeById");
const fetchAllRecipes = require("../controllers/recipes/fetchAllRecipes");
const addNewRecipe = require("../controllers/recipes/addNewRecipe");
const deleteRecipe = require("../controllers/recipes/deleteRecipe");

const recipesRoute = express.Router();

recipesRoute.get("/recipes", fetchAllRecipes);
recipesRoute.get("/recipes/:id", verifyUser, recipeById);
recipesRoute.post("/content-edit", verifyUser, addNewRecipe);
recipesRoute.get("/recipes/:id/delete", verifyUser, deleteRecipe);

module.exports = recipesRoute;
