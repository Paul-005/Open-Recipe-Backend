const Comments = require("../modals/CommentsModal");
const RecipeModal = require("../modals/RecipeModal");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

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
            user_id
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

// get a recipe by id
exports.fetchRecipeById = async (req, res) => {
    try {
        const recipeId = req.params.id;

        // Use aggregation with $match and $lookup for optimal performance
        const result = await RecipeModal.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(recipeId) } },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "recipe_id",
                    as: "comments"
                }
            },

        ]);

        if (!result || result.length === 0) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        res.status(200).json(result[0]);
    } catch (error) {
        console.error("Error fetching recipe by id:", error);
        res.status(500).json({ error: "Internal server error" });
    }


};

// Fetch all recipes
exports.fetchAllRecipes = async (req, res) => {
    try {
        const recipes = await RecipeModal.find({}, {
            _id: 1, recipeName: 1, RecipeContent: { $substrCP: ["$RecipeContent", 0, 20] },
            thumbnail: 1,
        });
        res.status(200).json(recipes);
    } catch (error) {
        console.error("Fetch all recipes error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// Fetch recipe by ID and delete it
exports.deleteRecipe = async (req, res) => {
    try {
        const recipe_id = req.params.id;
        const recipe = await RecipeModal.findById(recipe_id);

        const token = req.headers.token;
        const id = jwt.verify(token, process.env.JWT_SECRET);


        if (recipe.user_id.toString() === id) {
            RecipeModal.findByIdAndDelete(recipe_id);
            return res.status(200).json({ message: "Recipe deleted successfully" });
        }

        return res.status(404).json({ error: "Not authorized to access this recipe" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.editRecipe = async (req, res) => {
    const recipe_id = req.params.id;
    const recipe = await RecipeModal.findById(recipe_id);

    const token = req.headers.token;
    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    console.log(recipe.user_id.toString(),);

    if (recipe.user_id.toString() !== id) {
        return res.status(403).json({ error: "You don't have permission to edit this recipe" });
    }


    if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
    }

    const { recipeName, Incredients, RecipeContent, thumbnail } = req.body;


    // make an object with the changed variables
    const changedVariables = {};
    if (recipeName && recipeName.trim()) {
        changedVariables.recipeName = recipeName;
    }
    if (Incredients && Incredients.trim()) {
        changedVariables.Incredients = Incredients;
    }
    if (RecipeContent && RecipeContent.trim()) {
        changedVariables.RecipeContent = RecipeContent;
    }
    if (thumbnail && thumbnail.trim()) {
        changedVariables.thumbnail = thumbnail;
    }

    await RecipeModal.findByIdAndUpdate(recipe_id, changedVariables, { runValidators: true }).then(() => {
        res.status(200).json({ message: "Recipe updated successfully" });
    }).catch((error) => {
        res.status(500).json({ error: error.message });
    });
}

exports.addComment = async (req, res) => {
    const { comment } = req.body;
    const recipe_id = req.params.id;
    const token = req.headers.token;
    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    const commentData = new Comments({ comment, recipe_id, user_id: id });
    await commentData.save().then(() => {
        res.status(200).json({ message: "Comment added successfully" });
    }).catch((error) => {
        res.status(500).json({ error: error.message });
    });
}