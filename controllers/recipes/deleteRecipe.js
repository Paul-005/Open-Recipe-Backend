const RecipeModal = require("../../modals/RecipeModal");
const UserModal = require("../../modals/UserModal");

const deleteRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const userEmail = req.user.email;

    // Validate recipe ID
    if (!recipeId) {
      return res.status(400).json({ error: "Recipe ID is required" });
    }

    console.log("Deleting recipe with ID:", recipeId);

    // Find the recipe by ID first
    const recipe = await RecipeModal.findById(recipeId);
    console.log("Found recipe by ID:", recipe);

    if (!recipe) {
      console.log("Recipe not found");
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Check if the recipe belongs to the user
    if (recipe.email !== userEmail)
      return res
        .status(403)
        .json({ error: "You don't have permission to delete this recipe" });

    // Delete the recipe
    await RecipeModal.findByIdAndDelete(recipeId);

    // Remove the recipe from user's recipes_added array
    await UserModal.findOneAndUpdate(
      { email: userEmail },
      { $pull: { recipes_added: { recipe_id: recipeId } } }
    );

    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Delete recipe error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = deleteRecipe;
