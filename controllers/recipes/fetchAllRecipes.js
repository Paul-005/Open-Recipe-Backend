const RecipeModal = require("../../modals/RecipeModal");

const fetchAllRecipes = async (req, res) => {
  try {
    const recipes = await RecipeModal.find();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json(error.message);
    console.log(console.error(error.message));
  }
};

module.exports = fetchAllRecipes;

// RecipeContent: recipes.RecipeContent,
// recipeName: recipes.recipeName,
// _id: recipes._id
