const { decode } = require("jsonwebtoken");
const RecipeModal = require("../../modals/RecipeModal");

const deleteRecipe = async (req, res) => {
  try {
    const id = req.params.id;
    const email = decode(req.headers.token);

    RecipeModal.findById(id).then((res) => {
      // if (res.email === email) {
        RecipeModal.findByIdAndDelete(id)
          .then(() => res.status(200).send("success"))
          .catch((err) => res.json(err.message));
      // } else {
        // return res.status(401).send("unautharized");
      // }
    });
  } catch (error) {
    res.json({ error: error.message });
  }
};

module.exports = deleteRecipe;
