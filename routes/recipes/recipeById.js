const { Router } = require("express");

const RecipeModal = require("../../modals/RecipeModal");
const verifyUser = require("../auth/jwtVerifier");
const route = Router();

const recipeById = route.get("/recipes/:id", verifyUser, async (req, res) => {
  const id = req.params.id;

  console.log(req.headers.token);

  try {
    const recipes = await RecipeModal.findById(id);
    res.json(recipes);
  } catch (error) {
    res.json(error.message);
    console.log(console.error(error.message));
  }
});

module.exports = recipeById;
