const User = require("../models/user");
const bcrypt = require("bcrypt");
const { NotFoundError, BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const Words = require("../models/words");
const { ProfileInfoHelper, updateProfileHelper } = require("../helper/profile");

const getPendingUser = async (req, res, next) => {
  try {
    const pendingUsers = await User.find(
      { status: "Pending", role: "NormalUser" },
      "_id username email"
    );
    res.status(StatusCodes.OK).json({ pendingUsers });
  } catch (error) {
    next(error);
  }
};

const approveUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { status: "Approved" },
      { new: true }
    );

    if (!updatedUser) {
      throw new NotFoundError("User not found!");
    }
    res.status(StatusCodes.OK).json({ msg: "User approved Successfully" });
  } catch (error) {
    next(error);
  }
};

const rejectUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { status: "Rejected" },
      { new: true }
    );

    if (!updatedUser) {
      throw new NotFoundError("User not found!");
    }
    res.status(StatusCodes.OK).json({ msg: "User rejected Successfully" });
  } catch (error) {
    next(error);
  }
};

const addModerator = async (req, res, next) => {
  try {
    await User.create({ ...req.body });
    res
      .status(StatusCodes.CREATED)
      .json({ msg: "Moderator created Successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteModerator = async (req, res, next) => {
  try {
    const moderatorId = req.params.id;
    const moderator = await User.findOneAndDelete({ _id: moderatorId });
    if (!moderator) {
      throw new NotFoundError("Moderator not found!");
    }
    res
      .status(StatusCodes.NO_CONTENT)
      .json({ msg: "Moderator deleted Successfully" });
  } catch (error) {
    next(error);
  }
};

const updateModerator = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      throw new BadRequestError("Please provide all required data");
    }
    const moderatorId = req.params.id;

    // Create an object with the fields to update
    const updateFields = {};
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashPassword;
    }

    // Use findOneAndUpdate to update the moderator
    const updatedModerator = await User.findOneAndUpdate(
      { _id: moderatorId },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedModerator) {
      throw new NotFoundError("Moderator not found!");
    }

    res.status(StatusCodes.OK).json({ msg: "Moderator updated successfully" });
  } catch (error) {
    next(error);
  }
};

const getAllModerator = async (req, res, next) => {
  try {
    const moderators = await User.find(
      { role: "Moderator" },
      "_id username email"
    );
    res.status(StatusCodes.OK).json({ moderators });
  } catch (error) {
    next(error);
  }
};

const addInappropriateWord = async (req, res, next) => {
  try {
    const { word } = req.body;
    if (!word) {
      throw new NotFoundError("Word not found");
    }
    await Words.create({ word });
    res.status(StatusCodes.CREATED).json({ msg: "Inappropriate Word Added" });
  } catch (error) {
    next(error);
  }
};

const updateInappropriateWord = async (req, res, next) => {
  try {
    const wordId = req.params.id;
    const { word } = req.body;

    if (!word) {
      throw new BadRequestError("Please provide word");
    }

    const updatedWord = await Words.findOneAndUpdate(
      { _id: wordId },
      { word: word },
      { new: true }
    );

    if (!updatedWord) {
      throw new NotFoundError("Word not found");
    }

    res.status(StatusCodes.OK).json({ msg: "Words Updated Successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteInappropriateWord = async (req, res, next) => {
  try {
    const wordId = req.params.id;
    const deletedWord = await Words.findOneAndDelete({ _id: wordId });
    if (!deletedWord) {
      throw new NotFoundError("Word not found");
    }
    res
      .status(StatusCodes.NO_CONTENT)
      .json({ msg: "Word deleted Successfully" });
  } catch (error) {
    next(error);
  }
};

const getAllWords = async (req, res, next) => {
  try {
    const words = await Words.find();
    res.status(StatusCodes.OK).json({ words });
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
  getPendingUser,
  approveUser,
  rejectUser,
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
};
