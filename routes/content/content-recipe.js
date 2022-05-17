const express = require("express");

const RecipeModal = require("../../modals/RecipeModal");

const route = express.Router();
const jwt = require("jsonwebtoken");
const verifyUser = require("../auth/jwtVerifier");

const Content = route.post("/content-edit", verifyUser, (req, res) => {
  const email = jwt.decode(req.headers.token);

  const { recipeName, Incredients, RecipeContent } = req.body;

  const RecipeData = new RecipeModal({
    recipeName,
    Incredients,
    RecipeContent,
    email
  });

  RecipeData.save()
    .then((res) => res.json(res))
    .catch((err) => res.json(err.message));
});

module.exports = Content;

// const content_to_profile = async (res, email) => {
//   try {
//     const recipes = await UserModal.findOneAndUpdate(email, {
//       recipes: [{ recipes: res.recipeName }]
//     });
//     res.json(recipes);
//   } catch (error) {
//     res.json({ err: error.message });
//   }
// };
