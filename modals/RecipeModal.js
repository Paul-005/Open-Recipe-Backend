const Mongoose = require("mongoose");

const RecipeModal = Mongoose.model("Recipes", {
  recipeName: {
    type: String,
    required: true
  },
  Incredients: {
    type: String
  },
  RecipeContent: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  comment: { type: Array },
  like: {
    type: Number
  }
});

module.exports = RecipeModal;
