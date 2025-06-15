const jwt = require("jsonwebtoken");
const RecipeModal = require("../../modals/RecipeModal");
const mongoose = require("mongoose");


const ObjectId = mongoose.Types.ObjectId;


const getUsersProfile = async (req, res) => {
  if (!req.headers.token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET || "panoca_secret");
    const id = typeof decoded === 'string' ? decoded : decoded.id;

    const recipes = await RecipeModal.find({ user_id: new ObjectId(id) });
    console.log(recipes);

    return res.status(200).json(recipes);

  } catch (error) {
    console.error("Profile error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getUsersProfile;
