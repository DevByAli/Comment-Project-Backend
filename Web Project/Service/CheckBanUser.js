const cron = require("node-cron");
const User = require("../models/user");

const UnbanUserService = () => {
  const updateBannedStatus = async (userId) => {
    await User.findByIdAndUpdate(
      { _id: userId },
      { $set: { banExpiration: null, status: "Approved" } }
    );
    await User.findByIdAndUpdate(
      { _id: userId },
      { $set: { status: "Approved" } }
    );
  };

  // Schedule a task to run every 30 seconds
  cron.schedule("*/30 * * * * *", async () => {
    try {
      // Find users whose ban has expired
      const expiredUsers = await User.find({
        banExpiration: { $lte: new Date() },
      });
      console.log(expiredUsers);
      // Update the status of each expired user
      for (const user of expiredUsers) {
        await updateBannedStatus(user._id);
      }
    } catch (error) {
      console.error("Error in scheduled task:", error);
    }
  });
};

module.exports = UnbanUserService;
