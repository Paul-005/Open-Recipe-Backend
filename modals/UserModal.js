const Mongoose = require("mongoose");

const UserModal = Mongoose.model("Users", {
  email: {
    type: String,
    index: { unique: true },
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  recipes: {
    type: Array,
  },
  proMember: {
    id: {
      type: String,
    },
    payment: {
      type: Boolean,
    },
  },
  pro: {
    type: Boolean,
  },
});

module.exports = UserModal;
