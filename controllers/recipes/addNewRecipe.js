const jwt = require("jsonwebtoken");
const RecipeModal = require("../../modals/RecipeModal");
const UserModal = require("../../modals/UserModal");
const upload = require("../../start/recipeThumbUpload");
// const imageCompress = require("../../services/imageCompression");
const path = require("path");
const fs = require("fs").promises;

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

      // Compress the image
      const originalPath = req.file.path;
      const compressedFilename = `compressed_${req.file.filename}`;
      const compressedPath = path.join(
        path.dirname(originalPath),
        compressedFilename
      );

      // await imageCompress(originalPath, compressedPath);

      // Remove the original file
      // await fs.unlink(originalPath);

      const RecipeData = new RecipeModal({
        recipeName,
        Incredients,
        RecipeContent,
        email,
        pro: false,
        thumbnail: `uploads/${compressedFilename}`,
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
        file: `uploads/${compressedFilename}`,
        recipe: savedRecipe,
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error in addNewRecipe:", error);
      res
        .status(500)
        .json({ message: "An error occurred while processing your request." });
    }
  });
};

module.exports = addNewRecipe;
