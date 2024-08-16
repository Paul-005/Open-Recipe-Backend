const jwt = require("jsonwebtoken");
const RecipeModal = require("../../modals/RecipeModal");
const UserModal = require("../../modals/UserModal");
const upload = require("../../start/recipeThumbUpload");

const cloudinary = require("cloudinary").v2;

const addNewRecipe = (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      if (!req.file) {
        return res.status(400).json({ message: "No file selected!" });
      }

      const email = jwt.decode(req.headers.token);
      const { recipeName, Incredients, RecipeContent } = req.body;

      // Configuration
      cloudinary.config({
        cloud_name: "dqboa6lkh",
        api_key: "138151248382695",
        api_secret: "rwazo2w6VkRzgmmc0hU8r6J2SBA", // Click 'View API Keys' above to copy your API secret
      });

      // Upload an image
      const uploadResult = await cloudinary.uploader
        .upload("./uploads/outputImagePath.jpg")
        .catch((error) => {
          console.log(error);
        });

      const RecipeData = new RecipeModal({
        recipeName,
        Incredients,
        RecipeContent,
        email,
        pro: false,
        thumbnail: uploadResult.url,
      });

      const savedRecipe = await RecipeData.save();

      const updatedUser = await UserModal.findOneAndUpdate(
        { email },
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
      console.error("Error adding new recipe:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};
module.exports = addNewRecipe;
