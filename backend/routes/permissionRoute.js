const express = require("express");
const {
  askForPermission,
  getRequestFromFriend,
  acceptRequestFromFriend,
  declineRequestFromFriend,
} = require("../controllers/permissonController");
const router = express.Router();
const { auth } = require("../middleware/authUser");

router.post("/permission-request", auth, askForPermission);
router.get("/get-request-from-friend", auth, getRequestFromFriend);
router.post("/accept-request", auth, acceptRequestFromFriend);
router.delete("/decline-request", auth, declineRequestFromFriend);

module.exports = router;
