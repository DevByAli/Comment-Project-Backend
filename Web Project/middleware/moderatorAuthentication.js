const Authentication = require("../helper/auth");

const moderatorAuthentication = async (req, res, next) => {
  try {
    await Authentication(req, res, next, "Moderator");
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = moderatorAuthentication;
