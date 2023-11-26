const express = require("express");
const {
  getAllComments,
  postComment,
  createTopic,
  getComment,
  getMyComments,
  getAllTopic,
  getProfileInfo,
  updateProfile,
} = require("../Controllers/user");
const router = express.Router();

router.route("/comments").get(getAllComments).post(postComment);
router.route("/comment/:id").get(getComment);
router.route("/myComments").get(getMyComments);
router.route("/topics").get(getAllTopic).post(createTopic);
router.route("/profile").get(getProfileInfo).post(updateProfile);

module.exports = router;
