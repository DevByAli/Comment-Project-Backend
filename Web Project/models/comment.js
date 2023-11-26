const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please provide user id"],
    ref: "User"
  },
  topic: {
    type: String,
    required: [true, "Please provide topic"],
  },
  comment: {
    type: String,
    required: [true, "Please provide comment"],
  },
});

module.exports = mongoose.model("Comment", CommentSchema);
