const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const loginUser = asyncHandler(async (req, res) => {
  let { telefon } = req.body;
  if (telefon.startsWith("+")) {
    telefon = "0" + telefon.substring(3);
  }

  const user = await User.findOne({ telefon });

  if (user) {
    res.status(201);
    res.json({
      _id: user.id,
      telefon: user.telefon,
      token: generateJWTToken(user.id),
      user: user,
    });
  } else {
    const createdUser = await User.create({
      telefon,
    });

    if (createdUser) {
      res.status(201);
      res.json({
        _id: createdUser.id,
        username: createdUser.username,
        token: generateJWTToken(createdUser.id),
        user: createdUser,
      });
    }
  }
});

const updateUserLocation = asyncHandler(async (req, res) => {
  const { latitude, longitude } = req.body;
  const userJson = req.user;
  const user = await User.findById(userJson._id);
  if (!user) {
    res.status(400);
    throw new Error("No User");
  }
  user.location.latitude = latitude;
  user.location.longitude = longitude;
  await user.save();
  res.status(201);
  res.json(user);
});

const getUser = (req, res) => {
  res.status(200);
  res.json(req.user);
};

//deprecated
const getMyLocationById = asyncHandler(async (req, res) => {
  const userJson = req.user;
  const user = await User.findById(userJson._id);

  if (!user) {
    res.status(400);
    throw new Error("No User");
  }
  res.status(201);
  res.json({
    latitude: user.location.latitude,
    longitude: user.location.longitude,
  });
});

const generateJWTToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRETKEY, { expiresIn: "60d" });
};

module.exports = {
  loginUser,
  getUser,
  updateUserLocation,
  getMyLocationById,
};
