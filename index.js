const express = require("express");
require("express-async-errors");

const app = express();

const { PORT } = require("./utils/config");
const { connectToDatabase } = require("./utils/db");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const authorsRouter = require("./controllers/authors");
const readingListRouter = require("./controllers/list");
const sessionRouter = require("./controllers/sessions");

const middleware = require("./utils/middleware");

app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/authors", authorsRouter);
app.use("/api/readinglists", readingListRouter);
app.use("/api/logout", sessionRouter);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

start();
