const { Router } = require("express");
const { decode } = require("jsonwebtoken");
const RecipeModal = require("../../modals/RecipeModal");
const verifyUser = require("../../middlewares/jwtVerifier");

const route = Router();

const deleteRecipe = route.get(
  "/recipes/:id/delete",
  verifyUser,
  async (req, res) => {
    try {
      const id = req.params.id;
      const email = decode(req.headers.token);

      RecipeModal.findById(id)
        .then((result) => {
          if (result.email === email) {
            RecipeModal.findByIdAndDelete(id)
              .then(() => res.json("done"))
              .catch((err) => res.json({ err: err.message }));
          } else {
            return res.json({ err: "This is not Yours" });
          }
        })

        .catch((err) => res.json({ err: err.message, status: false }));
    } catch (error) {
      res.json({ error: error.message });
    }
  }
);

module.exports = deleteRecipe;
