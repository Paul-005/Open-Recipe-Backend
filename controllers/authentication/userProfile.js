const jwt = require("jsonwebtoken");
const UserModal = require("../../modals/UserModal");

const getUsersProfile = async (req, res) => {
  if (!req.headers.token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET || "panoca_secret");
    const userEmail = typeof decoded === 'string' ? decoded : decoded.email;

    const userProfile = await UserModal.findOne({ email: userEmail });
    if (!userProfile) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ 
      recipe: userProfile.recipes_added || [],
      pro: false 
    });
  } catch (error) {
    console.error("Profile error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getUsersProfile;
