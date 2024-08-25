const Mongoose = require("mongoose");

const RecipeModal = Mongoose.model("Recipes", {
  recipeName: {
    type: String,
    required: true,
  },
  Incredients: {
    type: String,
  },
  RecipeContent: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  like: {
    type: Number,
  },
  pro: {
    type: Boolean,
  },
  thumbnail: {
    type: String,
    required: true,
  },
});

module.exports = RecipeModal;
