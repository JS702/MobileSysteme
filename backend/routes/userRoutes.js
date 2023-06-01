const express = require("express");
const {
  loginUser,
  getUser,
  updateUserLocation,
  getMyLocationById,
} = require("../controllers/userController");
const router = express.Router();
const { auth } = require("../middleware/authUser");

router.post("/login", loginUser);
router.post("/update-user-location", auth, updateUserLocation);
router.get("/get-user", auth, getUser);
router.get("/get-location", auth, getMyLocationById);

module.exports = router;
