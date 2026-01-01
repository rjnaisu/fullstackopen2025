const express = require("express");
const config = require("./utils/config");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const middleware = require("./utils/middleware");
const blogRouter = require("./controllers/blogs");
const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

const app = express();
app.use(express.json());
app.use(middleware.tokenExtractor);

logger.info("Starting server", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(`Error connecting to DB ${err}`);
  });

app.use(express.static("dist"));
app.use(middleware.requestLogger);

app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
