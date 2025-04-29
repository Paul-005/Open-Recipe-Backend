const jwt = require("jsonwebtoken");
const RecipeModal = require("../../modals/RecipeModal");
const UserModal = require("../../modals/UserModal");
const cloudinary = require("cloudinary").v2;

const addNewRecipe = async (req, res) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.email) {
      return res.status(401).json({ error: "Invalid token or email not found in token" });
    }
    const email = decoded.email;

    const { recipeName, Incredients, RecipeContent } = req.body;
    
    if (!recipeName || !RecipeContent) {
      return res.status(400).json({ error: "Recipe name and content are required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No thumbnail image provided" });
    }

    // Configuration
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    // Upload the image from the uploaded file
    const uploadResult = await cloudinary.uploader.upload(req.file.path);

    // Create new recipe with verified email
    const RecipeData = new RecipeModal({
      recipeName,
      Incredients,
      RecipeContent,
      email: email, // Ensure email is set
      pro: false,
      thumbnail: uploadResult.url,
    });

    const savedRecipe = await RecipeData.save();
    
    // Update user's recipes
    const updatedUser = await UserModal.findOneAndUpdate(
      { email: email }, // Use the verified email
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
      file: uploadResult.url,
      recipe: savedRecipe,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error adding recipe:", error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

module.exports = addNewRecipe;
