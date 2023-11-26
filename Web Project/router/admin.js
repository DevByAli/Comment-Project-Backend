const express = require("express");
const router = express.Router();

const {
  approveUser,
  rejectUser,
  getPendingUser,
  addModerator,
  deleteModerator,
  updateModerator,
  getAllModerator,
  addInappropriateWord,
  updateInappropriateWord,
  deleteInappropriateWord,
  getAllWords,
  getProfileInfo,
  updateProfile,
} = require("../Controllers/admin");

// Normal User routes
router.route("/pendingRequests").get(getPendingUser);
router.route("/approve/:id").delete(approveUser);
router.route("/reject/:id").delete(rejectUser);

// Moderator Routes
router.route("/AddModerator").post(addModerator);
router.route("/deleteModerator/:id").delete(deleteModerator);
router.route("/updateModerator/:id").patch(updateModerator);
router.route("/allModerator").get(getAllModerator);

// Word routes
router.route("/AllWords").get(getAllWords);
router.route("/addWord").post(addInappropriateWord);
router.route("/updateWord/:id").post(updateInappropriateWord);
router.route("/deleteWord/:id").delete(deleteInappropriateWord);

// update profile
router.route("/profile").get(getProfileInfo);
router.route("/profile").post(updateProfile);

module.exports = router;
