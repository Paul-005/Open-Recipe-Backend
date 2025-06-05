const jwt = require("jsonwebtoken");
const RecipeModal = require("../../modals/RecipeModal");
const UserModal = require("../../modals/UserModal");

const addNewRecipe = async (req, res) => {
  try {
    const token = req.headers.token;

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.email) {
      return res.status(401).json({ error: "Invalid token or email not found in token" });
    }
    const email = decoded.email;

    const { recipeName, Incredients, RecipeContent, thumbnail } = req.body;

    if (!recipeName || !RecipeContent || !thumbnail || !Incredients) {
      return res.status(400).json({ error: "Recipe name and content are required" });
    }



    // Create new recipe with verified email
    const RecipeData = new RecipeModal({
      recipeName,
      Incredients,
      RecipeContent,
      email,
      pro: false,
      thumbnail, // Use secure_url from Cloudinary
    });

    try {
      const savedRecipe = await RecipeData.save();

      // Update user's recipes
      const updatedUser = await UserModal.findOneAndUpdate(
        { email: email },
        {
          $push: {
            recipes_added: {
              recipe: savedRecipe.recipeName,
              recipe_id: savedRecipe._id,
            },
          },
        },
        { new: true }
      );

      res.status(200).json({
        message: "Recipe added successfully!",
        file: thumbnail,
        recipe: savedRecipe,
        user: updatedUser,
        recipe_id: savedRecipe._id,
      });
    } catch (error) {
      console.error("Error adding recipe:", error);
      return res.status(500).json({ error: "Internal server error" });
    }


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

module.exports = addNewRecipe;
