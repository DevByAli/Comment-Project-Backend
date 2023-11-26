const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const Authentication = async (req, res, next, role) => {
  // check header
  const authHeader = req.headers.authorization;

  try {
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw new UnauthenticatedError("Authentication invalid");
    }
    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach the user to the job routes
    if (payload.role != role) {
      throw new UnauthenticatedError("Authentication invalid");
    }
    req.user = {
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
    };
  } catch (error) {
    next(error);
  }
};

module.exports = Authentication;
