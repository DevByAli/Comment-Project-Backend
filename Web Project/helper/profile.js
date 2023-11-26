const { NotFoundError, BadRequestError } = require("../errors");
const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");

const ProfileInfoHelper = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    res
      .status(StatusCodes.OK)
      .json({ _id: user._id, username: user.username, email: user.email });
  } catch (error) {
    next(error);
  }
};

const updateProfileHelper = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!email || !password || !username) {
      throw new BadRequestError("Provide username, email and password");
    }
    const userId = req.user.userId;

    const updateFields = {};
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashPassword;
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      throw new BadRequestError("User not found");
    }
    res.status(StatusCodes.OK).json({ msg: "Profile Updated" });
  } catch (error) {
    next(error);
  }
};

module.exports = { ProfileInfoHelper, updateProfileHelper };
