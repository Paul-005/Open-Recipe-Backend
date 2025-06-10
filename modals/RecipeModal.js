const Mongoose = require("mongoose");

const RecipeModal = Mongoose.model("Recipes", {
  recipeName: {
    type: String,
    required: true,
  },
  Incredients: {
    type: String,
    required: true,
  },
  RecipeContent: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
});

module.exports = RecipeModal;
