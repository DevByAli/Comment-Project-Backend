const mongoose = require("mongoose");

const WordSchema = new mongoose.Schema({
  word: {
    type: String,
    trim: true,
    unique: true,
  },
});

module.exports = mongoose.model("Words", WordSchema);
