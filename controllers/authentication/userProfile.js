const jwt = require("jsonwebtoken");
const UserModal = require("../../modals/UserModal");

const getUsersProfile = async (req, res) => {
  if (!req.headers.token) return res.status(401).send("Unautharized");

  const token = req.headers.token;

  try {
    const decoded = jwt.decode(token);
    try {
      const getProfile = await UserModal.findOne({ email: decoded });
      return res.json({ recipe: getProfile.recipes_added, pro: false });
    } catch (error) {
      res.status(500).json({ err: error.message });
    }
  } catch (error) {
    res.json({ err: error.message });
  }
};

module.exports = getUsersProfile;
