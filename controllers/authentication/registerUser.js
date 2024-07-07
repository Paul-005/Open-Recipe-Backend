const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const UserModal = require("../../modals/UserModal");

const JoiValSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(6).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  name: Joi.string().min(5),
});

const regsiterUser = async (req, res) => {
  const user = req.body;

  if (!user) return res.status(402);

  try {
    await JoiValSchema.validateAsync({
      email: user.email,
      password: user.password,
      name: user.name,
    });

    bcrypt.hash(user.password, 10, function (err, hash) {
      // Store hash in your password DB.
      if (err) return res.send("Error while hashing password", err);
      saveUsertoDB(user.email, hash, user.name);
    });
  } catch (err) {
    res.json({ err: err.details[0].message });
    res.end();
  }

  const saveUsertoDB = (email, hashPwd, name) => {
    var userToDB = {
      email,
      password: hashPwd,
      name,
    };

    const UserData = new UserModal(userToDB);

    UserData.save()
      .then(({ email, name }) => {
        console.log("created Account");
        const token = jwt.sign(user.email, "panoca_secret");
        res.json({ token, email, name });
      })
      .catch((err) => {
        if (err.code === 11000)
          res.json({
            error_code: err.code,
            err: "This Account already taken.",
          });
      });
  };
};

module.exports = regsiterUser;
