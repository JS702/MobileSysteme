const express = require("express");
const {
  loginUser,
  getUser,
  updateUserLocation,
  getMyLocationById,
  getFriendsLocationById,
  filterExistingNumbers,
} = require("../controllers/userController");
const router = express.Router();
const { auth } = require("../middleware/authUser");

router.post("/login", loginUser);
router.post("/update-user-location", auth, updateUserLocation);
router.get("/get-user", auth, getUser);
router.get("/get-location", auth, getMyLocationById);

router.get("/get-friendslocation", getFriendsLocationById);
router.get("/get-all-registered-friends", filterExistingNumbers);
module.exports = router;
