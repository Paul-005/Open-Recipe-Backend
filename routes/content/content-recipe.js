const express = require("express");

const RecipeModal = require("../../modals/RecipeModal");

const route = express.Router();
const jwt = require("jsonwebtoken");
const verifyUser = require("../auth/jwtVerifier");

const Content = route.post("/content-edit", verifyUser, (req, res) => {
  if (req.headers.token) {
    var token = req.headers.token;
  }

  jwt.verify(token, "panoca_secret", function (err, decoded) {
    try {
      if (err) return res.json({ msg: "Not autheicated" });
      const { recipeName, Incredients, RecipeContent } = req.body;

      const RecipeData = new RecipeModal({
        recipeName,
        Incredients,
        RecipeContent,
        email: decoded
      });

      RecipeData.save()
        .then((res) => res.json(res))
        .catch((err) => res.json(err.message));
    } catch (error) {
      res.json(error.message);
    }
  });
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
