const express = require("express");

const multer = require('multer');


// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../../uploads/'); // Define your upload directory
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize multer with storage configuration
const upload = multer({ storage: storage });

const verifyUser = require("../middlewares/jwtVerifier");
const recipeById = require("../controllers/recipes/fetchRecipeById");
const fetchAllRecipes = require("../controllers/recipes/fetchAllRecipes");
const addNewRecipe = require("../controllers/recipes/addNewRecipe");
const deleteRecipe = require("../controllers/recipes/deleteRecipe");

const recipesRoute = express.Router();

recipesRoute.get("/recipes", fetchAllRecipes);
recipesRoute.get("/recipes/:id", verifyUser, recipeById);
recipesRoute.post("/new-recipe-post", verifyUser, upload.single('file'), addNewRecipe);
recipesRoute.get("/recipes/:id/delete", verifyUser, deleteRecipe);

module.exports = recipesRoute;
