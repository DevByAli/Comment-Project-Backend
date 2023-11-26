const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide username"],
    trim: true,
    maxlength: [15, "Username cannot be more than 15 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 8,
  },
  role: {
    type: String,
    enum: ["Admin", "Moderator", "NormalUser"],
    default: "NormalUser",
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Banned"],
    default: "Pending",
  },
  banExpiration: {
    type: Date,
    default: null,
  },
});

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, username: this.username, role: this.role, status: this.status },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

// Method to approve a Normal User by Admin
UserSchema.methods.approveUser = function () {
  if (this.role === "NormalUser" && this.status === "Pending") {
    this.status = "Approved";
  }
};

// Method to reject a Normal User by Admin
UserSchema.methods.rejectUser = function () {
  if (this.role === "NormalUser" && this.status === "Pending") {
    this.status = "Rejected";
  }
};

// Method to ban a user for a specific number of days by Moderator
UserSchema.methods.banUser = function (banDurationInDays) {
  if (this.role !== "Admin" && this.status !== "Banned") {
    this.status = "Banned";
    const banExpiration = new Date();
    banExpiration.setDate(banExpiration.getDate() + banDurationInDays);
    this.banExpiration = banExpiration;
  }
};

module.exports = mongoose.model("User", UserSchema);
