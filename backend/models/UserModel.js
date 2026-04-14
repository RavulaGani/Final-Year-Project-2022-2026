const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: [
    {
      itemName: {
        type: String,
      },
      itemPrice: {
        type: String,
      },
      itemImage: {
        type: String,
      },
    },
  ],
  favourite: [
    {
      itemName: {
        type: String,
      },
      itemPrice: {
        type: String,
      },
      itemImage: {
        type: String,
      },
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
