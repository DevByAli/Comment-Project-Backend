const mongoose = require("mongoose");

const TopicSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: [true, "Please provide topic"],
    trim: true,
    unique: true,
    minlength: 1,
  },
});

module.exports = mongoose.model("Topics", TopicSchema);
