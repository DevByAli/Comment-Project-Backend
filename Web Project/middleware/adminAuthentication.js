const Authentication = require("../helper/auth");

const userAuthentication = async (req, res, next) => {
  try {
    await Authentication(req, res, next, "Admin");
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = userAuthentication;
