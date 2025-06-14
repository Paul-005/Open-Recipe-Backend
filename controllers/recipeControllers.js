const RecipeModal = require("../modals/RecipeModal");
const jwt = require("jsonwebtoken");

// Add new recipe
exports.addNewRecipe = async (req, res) => {
    try {
        const token = req.headers.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.id) {
            return res.status(401).json({ error: "Invalid token not found in token" });
        }
        const user_id = decoded.id;
        const { recipeName, Incredients, RecipeContent, thumbnail } = req.body;

        if (!recipeName || !RecipeContent || !thumbnail || !Incredients) {
            return res.status(400).json({ error: "Recipe name and content are required" });
        }

        const RecipeData = new RecipeModal({
            recipeName,
            Incredients,
            RecipeContent,
            thumbnail,
            user_id: user_id
        });

        await RecipeData.save();


        res.status(200).json({
            message: "Recipe added successfully!"
        });
    } catch (error) {
        console.error("Error adding recipe:", error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Invalid token" });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Delete a recipe
exports.deleteRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const userEmail = req.user.email;

        if (!recipeId) {
            return res.status(400).json({ error: "Recipe ID is required" });
        }

        const recipe = await RecipeModal.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        if (recipe.email !== userEmail) {
            return res.status(403).json({ error: "You don't have permission to delete this recipe" });
        }

        await RecipeModal.findByIdAndDelete(recipeId);


        res.json({ message: "Recipe deleted successfully" });
    } catch (error) {
        console.error("Delete recipe error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Fetch all recipes
exports.fetchAllRecipes = async (req, res) => {
    try {
        const recipes = await RecipeModal.find();
        res.status(200).json(recipes);
    } catch (error) {
        console.error("Fetch all recipes error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// Fetch recipe by ID
exports.fetchRecipeById = async (req, res) => {
    try {
        const id = req.params.id;
        const recipe = await RecipeModal.findById(id);

        if (!recipe) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        res.json(recipe);
    } catch (error) {
        console.error("Fetch recipe by ID error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

