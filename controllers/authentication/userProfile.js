const jwt = require("jsonwebtoken");
const UserModal = require("../../modals/UserModal");
const stripe = require("stripe")(
  "sk_test_51JGPiESGsKLMr3E0SUPCLs7KHD5Q5MLY1SfkEGcW5cfaGKTgahKbeFtRjhn117w1qLr0pXy7Kjpk5PoYbohVnzd000RIndH1Cu"
);

const getUsersProfile = async (req, res) => {
  if (!req.headers.token)
    return res
      .status(401)
      .send("Unautharized");

  const token = req.headers.token;

  try {
    const decoded = jwt.decode(token);
    try {
      const getProfile = await UserModal.findOne({ email: decoded });
      if (getProfile.proMember.id !== undefined) {
        const proMember = await stripe.checkout.sessions.retrieve(
          getProfile.proMember.id
        );
      if (proMember.payment_status == "paid")
          return res.json({ recipe: getProfile.recipes_added , pro: true });
      
      } else return res.json({ recipe: getProfile.recipes_added, pro: false });
    } catch (error) {
      res.status(500).json({ err: error.message });
    }
  } catch (error) {
    res.json({ err: error.message });
  }
};

module.exports = getUsersProfile;
