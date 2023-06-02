const express = require("express");
const {
  askForPermission,
  getRequestFromFriend,
  acceptRequestFromFriend,
  declineRequestFromFriend,
  getLocationFromFriend,
} = require("../controllers/permissonController");
const router = express.Router();
const { auth } = require("../middleware/authUser");

router.post("/permission-request", auth, askForPermission);
router.get("/get-request-from-friend", auth, getRequestFromFriend);
router.post("/accept-request", auth, acceptRequestFromFriend);
router.delete("/decline-request", auth, declineRequestFromFriend);

router.get("/get-location-from-friend", auth, getLocationFromFriend);

module.exports = router;
