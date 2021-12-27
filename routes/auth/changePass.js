const { Router } = require("express");
const UserModal = require("../../modals/UserModal");

const route = Router();

const changePass = route.post("/changepass", async (req, res) => {
  if (!req.body.headers) {
    return res.send("go and login first");
  }

  try {
    const user = await UserModal.findOne({ email: req.body.headers.email });
    res.json(user);
  } catch (error) {
    res.json(error.message);
    console.log(console.error(error.message));
  }
});

module.exports = changePass;

// Http request

// {
//   "headers": {
//   	"email": "test@google.com",
//     "password": "123456"
//   }
// }
