const express = require("express");
const router = express.Router();

const {
  deleteTopic,
  banUser,
  getUnBannedUser,
  getTopics,
  getProfileInfo,
  updateProfile,
} = require("../Controllers/moderator");

router.route("/deleteTopic/:id").delete(deleteTopic);
router.route("/topics").get(getTopics);
router.route("/banUser/:id").post(banUser);
router.route("/unbannedUser").get(getUnBannedUser);
router.route("/profile").get(getProfileInfo).post(updateProfile);

module.exports = router;
