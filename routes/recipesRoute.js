const express = require("express");

const verifyUser = require("../middlewares/jwtVerifier");
const recipeById = require("../controllers/recipes/fetchRecipeById");
const fetchAllRecipes = require("../controllers/recipes/fetchAllRecipes");
const addNewRecipe = require("../controllers/recipes/addNewRecipe");
const deleteRecipe = require("../controllers/recipes/deleteRecipe");
const upload = require("../start/recipeThumbUpload");

const recipesRoute = express.Router();

// Base route for recipes
recipesRoute.get("/", fetchAllRecipes);
recipesRoute.get("/:id", verifyUser, recipeById);
recipesRoute.post("/new", verifyUser, upload, addNewRecipe);
recipesRoute.delete("/:id", verifyUser, deleteRecipe);

module.exports = recipesRoute;
