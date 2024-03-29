const express = require("express");

const route = express.Router();
const jwt = require("jsonwebtoken");

const verifyUser = require("../../middlewares/jwtVerifier");
const RecipeModal = require("../../modals/RecipeModal");
const UserModal = require("../../modals/UserModal");

const Content = route.post("/content-edit", verifyUser, (req, res) => {
  const email = jwt.decode(req.headers.token);

  var userIsPro = false;

  UserModal.findOne({ email })
    .then((result) => {
      const user = result;
      if (user) userIsPro = true;
    })
    .catch((err) => res.status(500).send("server error"));

  const { recipeName, Incredients, RecipeContent } = req.body;

  const RecipeData = new RecipeModal({
    recipeName,
    Incredients,
    RecipeContent,
    email,
    pro: userIsPro,
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
