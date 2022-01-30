const Mongoose = require("mongoose");

const UserModal = Mongoose.model("Users", {
  email: {
    type: String,
    index: { unique: true },
    required: true
  },
  password: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  recipes: {
    type: Array
  }
});

module.exports = UserModal;
