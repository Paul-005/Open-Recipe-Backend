const express = require("express");

const RecipeModal = require("../../modals/RecipeModal");

const route = express.Router();
const jwt = require("jsonwebtoken");

var Content = route.post("/content-edit", (req, res) => {
  if (req.headers.token) {
    var token = req.headers.token;
  }

  console.log(req.files);

  if (token === undefined) res.redirect("/login");

  jwt.verify(token, "panoca_secret", function (err, decoded) {
    try {
      if (err) {
        res.redirect("/login");
        res.json({ msg: "Not autheicated" });
        // console.log(err);
      }
      const { recipeName, Incredients, RecipeContent } = req.body;

      const RecipeData = new RecipeModal({
        recipeName,
        Incredients,
        RecipeContent,
        email: decoded
      });

      RecipeData.save()
        .then((res) => console.log(res))
        .catch((err) => res.json(err.message));
    } catch (error) {
      console.log(error.message);
    }
  });

  console.log(req.body);
});

module.exports = Content;
