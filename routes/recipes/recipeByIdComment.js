const { Router } = require("express");
const RecipeModal = require("../../modals/RecipeModal");
const verifyUser = require("../auth/jwtVerifier");

const route = Router();

const recipeByIdComment = route.post(
  "/recipes/:id",
  verifyUser,
  async (req, res) => {
    const id = req.params.id;

    // comment pushing algorithm
    const commentArray = async () => {
      const recipesComment = await RecipeModal.findById(id);
      var comment = recipesComment.comment;
      comment.push({ email: recipesComment.email, comment: req.body.comment });
      return comment;
    };

    try {
      const comment = commentArray();

      const recipes = await RecipeModal.findByIdAndUpdate(id, {
        comment
      });

      res.json(recipes);
    } catch (error) {
      res.json(error.message);
      console.log(console.error(error.message));
    }
  }
);

module.exports = recipeByIdComment;
