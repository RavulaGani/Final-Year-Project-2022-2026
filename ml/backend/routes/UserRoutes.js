const express = require("express");
const {
  registerUser,
  loginUser,
  singleUser,
  addToCart,
  deleteCartItem,
  addToFavourite,
  deleteFavouriteItem,
} = require("../controllers/UserController");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/singleUser", singleUser);

router.post("/addItem", addToCart);

router.post("/delete", deleteCartItem);

router.post("/addFavItem", addToFavourite);

router.post("/deleteFavItem", deleteFavouriteItem);

module.exports = router;
