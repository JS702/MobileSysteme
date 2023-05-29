const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }
  const userExist = await User.findOne({ username });

  if (userExist) {
    res.status(400);
    throw new Error("User already exist");
  }
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const user = await User.create({
    username,
    password: hashedPassword,
  });

  if (user) {
    res.status(201);
    res.json({
      _id: user.id,
      username: user.username,
      token: generateJWTToken(user.id),
      user: user,
    });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(201);
    res.json({
      _id: user.id,
      username: user.username,
      token: generateJWTToken(user.id),
      user: user,
    });
  } else {
    res.status(400);
    throw new Error("Wrong Password or Email");
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
  registerUser,
  loginUser,
  getUser,
  updateUserLocation,
  getMyLocationById,
};
