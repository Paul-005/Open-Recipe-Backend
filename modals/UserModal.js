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
  recipes_added: [
    {
      recipe: String,
      recipe_id: String,
      createdAt: {
        type: Date,
        default: Date.now, // Set the default value to the current timestamp
      },
    },
  ],
});

module.exports = UserModal;
