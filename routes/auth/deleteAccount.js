const { Router } = require("express");
const UserModal = require("../../modals/UserModal");

const route = Router();

const deleteAccount = route.post("/deleteAccount", async (req, res) => {
  if (!req.body.headers) {
    return res.send("go and login first");
  }
  console.log(req.body.headers);

  try {
    const user = await UserModal.findOneAndDelete({
      email: req.body.headers.email
    });
    res.json(user);
  } catch (error) {
    res.json(error.message);
    console.log(console.error(error.message));
  }
});

module.exports = deleteAccount;

// Http request

// {
//   "headers": {
//   	"email": "test@google.com",
//     "password": "123456"
//   }
// }
