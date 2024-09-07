const jwt = require("jsonwebtoken");
const RecipeModal = require("../../modals/RecipeModal");
const UserModal = require("../../modals/UserModal");

const cloudinary = require("cloudinary").v2;

const addNewRecipe = async (req, res) => {
  const email = jwt.decode(req.headers.token);
  const { recipeName, Incredients, RecipeContent } = req.body;

  try {
    // Configuration
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });


    // Upload an image
    const uploadResult = await cloudinary.uploader.upload(
      "./uploads/uploaded_thumbnail.jpg"
    );

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
  } catch (err) {
    return res.json(err.message);
  }
};
module.exports = addNewRecipe;
