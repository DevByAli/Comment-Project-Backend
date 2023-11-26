const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");
const Comment = require("../models/comment");
const Topic = require("../models/topic");
const filterHelper = require("../helper/filter");

const { ProfileInfoHelper, updateProfileHelper } = require("../helper/profile");

const getComment = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const result = await Comment.findOne({ _id: commentId });
    if (!result) {
      throw new NotFoundError("Comment not found!");
    }
    res
      .status(StatusCodes.OK)
      .json({ topic: result.topic, comment: result.comment });
  } catch (error) {
    next(error);
  }
};

const getAllComments = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const comments = await Comment.find().populate("userId", "username");

    const result = comments.map((comment) => ({
      id: comment._id,
      topic: comment.topic,
      comment: comment.comment, // Use comment.comment instead of comment.content
      username: comment.userId ? comment.userId.username : "Unknown User", // Handle the case where userId is not available
    }));

    res.status(StatusCodes.OK).json({ result });
  } catch (error) {
    next(error);
  }
};

const getMyComments = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const comments = await Comment.find({ userId: userId });
    res.status(StatusCodes.OK).json({ comments });
  } catch (error) {
    next(error);
  }
};

const postComment = async (req, res, next) => {
  try {
    const { topic, comment } = req.body;

    // Filter comment
    const filteredComment = await filterHelper(comment);
    await Comment.create({
      userId: req.user.userId,
      topic: topic,
      comment: filteredComment,
    });
    res.status(StatusCodes.CREATED).json({
      id: req.user.userId,
      username: req.user.name,
      topic: topic,
      comment: filteredComment,
    });
  } catch (error) {
    next(error);
  }
};

const getAllTopic = async (req, res, next) => {
  try {
    const topics = await Topic.find();
    res.status(StatusCodes.OK).json({ topics });
  } catch (error) {
    next(error);
  }
};

const createTopic = async (req, res, next) => {
  try {
    const { topic } = req.body;

    // Filtering the Topic
    const filteredTopic = await filterHelper(topic);
    await Topic.create({ topic: filteredTopic });
    res.status(StatusCodes.CREATED).json({ msg: "Word added" });
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
  getComment,
  getAllComments,
  postComment,
  getMyComments,
  getAllTopic,
  createTopic,
  getProfileInfo,
  updateProfile,
};
