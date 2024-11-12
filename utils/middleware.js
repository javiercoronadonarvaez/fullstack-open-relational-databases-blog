const jwt = require("jsonwebtoken");
const logger = require("./logger");
const { SECRET } = require("../utils/config");

const { Blog } = require("../models");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

const unknownEndpoint = (request, response) => {
  console.log("ERROR HANDLER ENDPOINT");
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  console.log("ERROR HANDLER");
  //   console.log("ERROR!!!!", error);
  if (error.name === "SyntaxError") {
    return response.status(400).send({ error: "Malformatted Request Body" });
  } else if (error.name === "SequelizeValidationError") {
    return response.status(400).json({ error: error.errors[0].message });
  } else if (error.name === "SequelizeDatabaseError") {
    const dbErrorMessage = error.parent.message;
    return response.status(400).json({ error: dbErrorMessage });
  } else if (error.name === "TypeError") {
    return response.status(400).json({ error: "Blog key inexistent" });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "token invalid" });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    });
  }

  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  blogFinder,
};
