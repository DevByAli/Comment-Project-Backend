const express = require("express");
const connectDB = require("./db/connect");
const cors = require("cors");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const adminAuthentication = require("./middleware/adminAuthentication");
const userAuthentication = require("./middleware/userAuthentication");
const moderatorAuthentication = require("./middleware/moderatorAuthentication");
const UnbanUserService = require("./Service/CheckBanUser");

const authRouter = require("./router/auth");
const adminRouter = require("./router/admin");
const userRouter = require("./router/user");
const moderatorRotuer = require("./router/moderator");

require("dotenv").config();
const app = express();


app.use(cors());
app.use(express.json());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminAuthentication, adminRouter);
app.use("/api/v1/user", userAuthentication, userRouter);
app.use("/api/v1/moderator", moderatorAuthentication, moderatorRotuer);

// Middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Service check after every 30 seconds to UnBan user who's banExpiration is Expired
UnbanUserService();

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
