const UserModel = require("../models/UserModel");

exports.registerUser = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send({
        message: "Please fill all fileds",
        success: false,
      });
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(401).send({
        message: "User already exists",
        success: false,
      });
    }
    const user = new UserModel({ name, password, email });
    await user.save();
    return res.status(201).send({
      message: "User registered succesfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error creating user",
      success: false,
      error,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).send({
        message: "Please fill all fields",
        success: false,
      });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(500).send({
        message: "User dosent exists",
        success: false,
      });
    }

    if (password != user.password) {
      return res.status(500).send({
        message: "Password do not match",
        success: false,
      });
    }
    return res.status(200).send({
      message: "User login succesfull",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(501).send({
      message: "User login failed",
      success: false,
      error,
    });
  }
};

exports.singleUser = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    }
    return res.status(200).send({
      message: "User data",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(501).send({
      message: "User login failed",
      success: false,
      error,
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { itemName, itemPrice, itemImage, id } = req.body;
    const user = await UserModel.findById(id);
    user.cart.push({
      itemName: itemName,
      itemPrice: itemPrice,
      itemImage: itemImage,
    });

    await user.save();
    return res.status(200).send({
      message: "success",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(501).send({
      message: "Internal Error",
      success: false,
      error,
    });
  }
};

exports.deleteCartItem = async (req, res) => {
  const { userID, itemID } = req.body;

  try {
    const user = await UserModel.findByIdAndUpdate(
      userID,
      { $pull: { cart: { _id: itemID } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Item deleted successfully", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.addToFavourite = async (req, res) => {
  try {
    const { itemName, itemPrice, itemImage, id } = req.body;
    const user = await UserModel.findById(id);
    user.favourite.push({
      itemName: itemName,
      itemPrice: itemPrice,
      itemImage: itemImage,
    });

    await user.save();
    return res.status(200).send({
      message: "success",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(501).send({
      message: "Internal Error",
      success: false,
      error,
    });
  }
};

exports.deleteFavouriteItem = async (req, res) => {
  const { userID, itemID } = req.body;

  try {
    const user = await UserModel.findByIdAndUpdate(
      userID,
      { $pull: { favourite: { _id: itemID } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Item deleted successfully", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
