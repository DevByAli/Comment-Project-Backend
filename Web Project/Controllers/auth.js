const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res, next) => {
  try {
    await User.create({ ...req.body });
    res.status(StatusCodes.CREATED).json({ msg: "Request is send to Admin!" });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError("Please provide email and password");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new UnauthenticatedError("Invalid Credentials");
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid Credentials");
    }
    const userStatus = user.status;
    if (userStatus !== "Approved") {
      return res
        .status(StatusCodes.OK)
        .json({
          userId: user._id,
          username: user.username,
          role: user.role,
          status: userStatus,
        });
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({
      userId: user._id,
      username: user.username,
      role: user.role,
      status: userStatus,
      token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
