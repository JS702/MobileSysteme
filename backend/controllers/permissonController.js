const User = require("../models/userModel");
const Permission = require("../models/permissionModel");
const asyncHandler = require("express-async-handler");

const unifyNumbers = (tele) => {
  let telefon = tele;
  if (telefon.startsWith("+")) {
    telefon = "0" + telefon.substring(3);
  }
  return telefon.split(" ").join("");
};

const askForPermission = asyncHandler(async (req, res) => {
  let friendsTelefon = unifyNumbers(req.body.friendsTelefon);
  const userJson = req.user;
  const user = await User.findById(userJson._id);

  const friend = await User.findOne({ telefon: friendsTelefon });

  if (!user) {
    res.status(400);
    throw new Error("No User");
  }

  if (!friendsTelefon) {
    res.status(400);
    throw new Error("Add friend name");
  }

  if (!friend) {
    res.status(400);
    throw new Error("No Friend with that name");
  }

  const relationshipExist = await Permission.findOne({
    user: user._id,
    friend: friend._id,
  });

  if (relationshipExist) {
    res.status(400);
    throw new Error("Already sent");
  }

  const relationShip = await Permission.create({
    user: user.telefon,
    friend: friend.telefon,
  });

  if (relationShip) {
    res.status(201);
    res.json(relationShip);
  }
});

const getRequestFromFriend = asyncHandler(async (req, res) => {
  const userJson = req.user;
  const user = await User.findById(userJson._id);

  if (!user) {
    res.status(400);
    throw new Error("No User");
  }

  const listOfRequest = await Permission.find({ friend: user.telefon });

  if (!listOfRequest) {
    res.status(400);
    throw new Error("No requests");
  }

  res.status(201);
  res.json(listOfRequest);
});

const deleteAllRequestsFromFriend = asyncHandler(async (req, res) => {
  const userJson = req.user;
  const user = await User.findById(userJson._id);

  if (!user) {
    res.status(400);
    throw new Error("No User");
  }

  await Permission.deleteMany({ friend: user.telefon });

  res.status(200).json({ message: "All requests deleted successfully" });
});

const acceptRequestFromFriend = asyncHandler(async (req, res) => {
  const id = req.body.id;
  const userJson = req.user;
  const user = await User.findById(userJson._id);

  if (!user) {
    res.status(400);
    throw new Error("No User");
  }

  const request = await Permission.findById(id);

  if (!request) {
    res.status(400);
    throw new Error("No request found");
  }

  request.status = "accepted";
  await request.save();

  res.status(200).json(request);
});

const declineRequestFromFriend = asyncHandler(async (req, res) => {
  const id = req.body.id;
  const userJson = req.user;
  const user = await User.findById(userJson._id);

  if (!user) {
    res.status(400);
    throw new Error("No User");
  }
  const request = await Permission.deleteOne({ _id: id });
  res.status(200).json(request);
});

const getLocationFromFriend = asyncHandler(async (req, res) => {
  let friendsTelefon = unifyNumbers(req.body.friendsTelefon);
  const userJson = req.user;

  const permission = await Permission.findOne({
    user: userJson.telefon,
    friend: friendsTelefon,
  });

  if (!permission) {
    res.status(400);
    throw new Error("No request was found or declined");
  }

  if (permission.status === "pending") {
    res.status(400);
    throw new Error("pending request");
  }

  if (permission.status === "accepted") {
    const friend = await User.findOne({ telefon: permission.friend });
    res.status(200).json(friend);
  }
});

module.exports = {
  askForPermission,
  getRequestFromFriend,
  acceptRequestFromFriend,
  declineRequestFromFriend,
  getLocationFromFriend,
  deleteAllRequestsFromFriend,
};
