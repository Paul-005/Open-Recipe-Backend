const RecipeModal = require("../../modals/RecipeModal");
const UserModal = require("../../modals/UserModal");

const deleteRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const userEmail = req.user.email;

    console.log("Delete request received for recipe ID:", recipeId);
    console.log("User email:", userEmail);

    // Validate recipe ID
    if (!recipeId) {
      console.log("No recipe ID provided");
      return res.status(400).json({ error: "Recipe ID is required" });
    }

    // Find ALL recipes to debug
    const allRecipes = await RecipeModal.find();
    console.log("All recipes in database:", allRecipes.map(r => ({ id: r._id, email: r.email })));

    // Find the recipe by ID first
    const recipe = await RecipeModal.findById(recipeId);
    console.log("Found recipe by ID:", recipe ? {
      id: recipe._id,
      email: recipe.email,
      name: recipe.recipeName
    } : null);
    
    if (!recipe) {
      console.log("Recipe not found");
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Check if the recipe belongs to the user
    if (recipe.email !== userEmail) {
      console.log("Recipe doesn't belong to user");
      console.log("Recipe email:", recipe.email);
      console.log("User email:", userEmail);
      return res.status(403).json({ error: "You don't have permission to delete this recipe" });
    }

    // Delete the recipe
    await RecipeModal.findByIdAndDelete(recipeId);
    console.log("Recipe deleted successfully");
    
    // Remove the recipe from user's recipes_added array
    await UserModal.findOneAndUpdate(
      { email: userEmail },
      { $pull: { recipes_added: { recipe_id: recipeId } } }
    );
    console.log("Recipe removed from user's recipes list");
    
    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Delete recipe error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = deleteRecipe;
