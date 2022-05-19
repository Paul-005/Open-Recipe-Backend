const { Router } = require("express");
const verifyUser = require("./jwtVerifier");
const jwt = require("jsonwebtoken");
const RecipeModal = require("../../modals/RecipeModal");
const UserModal = require("../../modals/UserModal");
const stripe = require("stripe")(
  "sk_test_51JGPiESGsKLMr3E0SUPCLs7KHD5Q5MLY1SfkEGcW5cfaGKTgahKbeFtRjhn117w1qLr0pXy7Kjpk5PoYbohVnzd000RIndH1Cu"
);

const route = Router();

const getUsersRecipe = route.get(
  "/get-users-recipe",
  verifyUser,
  async (req, res) => {
    if (req.headers.token) {
      var token = req.headers.token;
    }
    try {
      const decoded = jwt.decode(token);
      try {
        const getRecipe = await RecipeModal.find({ email: decoded });
        const getProfile = await UserModal.findOne({ email: decoded });
        if (getProfile.proMember.id !== undefined) {
          const proMember = await stripe.checkout.sessions.retrieve(
            getProfile.proMember.id
          );
          if (proMember.payment_status == "paid") {
            return res.json({ getRecipe, pro: true });
          } else {
            return res.json({ getRecipe, pro: false });
          }
        } else {
          return res.json({ getRecipe, pro: false });
        }
      } catch (error) {
        res.status(500).json({ err: error.message });
      }
    } catch (error) {
      res.json({ err: error.message });
    }
  }
);

module.exports = getUsersRecipe;
