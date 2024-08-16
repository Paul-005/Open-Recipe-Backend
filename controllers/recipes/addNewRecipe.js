const jwt = require("jsonwebtoken");
const RecipeModal = require("../../modals/RecipeModal");
const UserModal = require("../../modals/UserModal");
const upload = require("../../start/recipeThumbUpload");
const imageCompress = require("../../services/imageCompression");
const path = require("path");
const deleteFiles = require("../../services/deleteUploadedImages");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const s3Client = require("../../start/s3cloud");



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

      const id = Date.now();

      // Compress the image
      const originalPath = req.file.path;
      const compressedFilename = `${id}_${req.file.filename}`;

       imageCompress(originalPath, compressedFilename);



      // Upload the compressed image to S3
      const command = new PutObjectCommand({
        Bucket: "recipethumb",
        Key: compressedFilename,
        Body: fs.readFileSync(`/home/user/Open-Recipe-Backend/uploads/${compressedFilename}`),
        ACL: "public-read", // This makes the file publicly accessible
      });

      try {
        const response = await s3Client.send(command);
        console.log("File uploaded successfully:", response);
      } catch (error) {
        console.error("Error uploading file:", error);
      }

      // Remove the original file
      // await fs.unlink(originalPath);

      const RecipeData = new RecipeModal({
        recipeName,
        Incredients,
        RecipeContent,
        email,
        pro: false,
        thumbnail: `https://cellar-c2.services.clever-cloud.com/recipethumb/${compressedFilename}`,
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
        file: `https://cellar-c2.services.clever-cloud.com/recipethumb/${compressedFilename}`,
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
