const Topic = require("../models/topic");
const User = require("../models/user");
const Comment = require("../models/comment");
const { NotFoundError, BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const { ProfileInfoHelper, updateProfileHelper } = require("../helper/profile");
const topic = require("../models/topic");

const deleteTopic = async (req, res, next) => {
  try {
    const { topic } = await Topic.findOneAndDelete({ _id: req.params.id });
    if (!topic) {
      throw new NotFoundError("ID doesn't exist");
    }
    await Comment.deleteMany({ topic: topic });
    res.status(StatusCodes.NO_CONTENT).json({ msg: "Topic deleted" });
  } catch (error) {
    next(error);
  }
};

const getTopics = async (req, res, next) => {
  try {
    const topics = await topic.find();
    res.status(StatusCodes.OK).json({ topics });
  } catch (error) {
    next(error);
  }
};

const getUnBannedUser = async (req, res, next) => {
  try {
    const users = await User.find({
      banExpiration: null,
      role: "NormalUser",
      status: "Approved",
    });

    const response = users.map((obj) => {
      const user = {};
      user._id = obj._id;
      user.username = obj.username;
      user.email = obj.email;
      user.status = obj.status;
      return user;
    });

    res.status(StatusCodes.OK).json({ response });
  } catch (error) {
    next(error);
  }
};

const banUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { days } = req.body;
    if (!days) {
      throw new BadRequestError("Please provide days");
    }

    const banExpiration = new Date();
    banExpiration.setDate(banExpiration.getDate() + parseInt(days));

    await User.updateOne(
      { _id: userId },
      { $set: { banExpiration: banExpiration, status: "Banned" } }
    );

    res.status(StatusCodes.OK).json({ msg: "User Banned" });
  } catch (error) {
    next(error);
  }
};

const getProfileInfo = async (req, res, next) => {
  try {
    await ProfileInfoHelper(req, res, next);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    await updateProfileHelper(req, res, next);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUnBannedUser,
  getTopics,
  deleteTopic,
  banUser,
  getProfileInfo,
  updateProfile,
};
