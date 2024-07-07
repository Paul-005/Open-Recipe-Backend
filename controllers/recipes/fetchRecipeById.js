const RecipeModal = require("../../modals/RecipeModal");

const recipeById = async (req, res) => {
  const id = req.params.id;

  try {
    const recipes = await RecipeModal.findById(id);
    res.json(recipes);
  } catch (error) {
    res.json(error.message);
    console.log(console.error(error.message));
  }
};

module.exports = recipeById;
