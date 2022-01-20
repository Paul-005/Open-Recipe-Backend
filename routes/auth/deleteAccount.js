const { Router } = require("express");
const jwt = require("jsonwebtoken");
const UserModal = require("../../modals/UserModal");
const verifyUser = require("./jwtVerifier");

const route = Router();

const deleteAccount = route.post(
  "/deleteAccount",
  verifyUser,
  async (req, res) => {
    try {
      jwt.verify(req.headers.token, "panoca_secret", async function (
        err,
        email
      ) {
        if (err) return res.json({ error: err.message });
        await UserModal.findOneAndDelete({ email });
        return res.send("Deleted Successfully");
      });
    } catch (error) {
      res.json(error.message);
    }
  }
);

module.exports = deleteAccount;

// Http request

// {
//   "headers": {
//   	"email": "test@google.com",
//     "password": "123456"
//   }
// }
