const { Router } = require("express");

const RecipeModal = require("../../modals/RecipeModal");
const route = Router();

const recipe = route.get("/recipes", async (req, res) => {
  try {
    const recipes = await RecipeModal.find();
    res.json(recipes);
  } catch (error) {
    res.json(error.message);
    console.log(console.error(error.message));
  }
});

module.exports = recipe;