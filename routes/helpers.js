let Token = require('../models/token');
let User = require('../models/user');

let handleError = (err, res) => {
  console.log("========================");
  console.log(`= ERROR: ${err.message}`);
  console.log("========================");

  res.
    status(500).
    json({ error: "Dang. That's definitely our bad." });
}

let handleNotAuthorized = (res) => {
  res.
    status(401).
    json({ error: "Bearer token unrecognized." });
}

let handleNotFound = (res) => {
  res.
    status(404).
    json({ error: "Resource not found." });
}

let requireTokenMiddleware = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    // Grab token from auth header like:
    // `Authorization: Bearer 1234567890`
    let authorizationToken = req.headers.authorization.toString().split(" ")[1];
    res.locals.token = await Token.findById(authorizationToken).exec();

    if (res.locals.token) {
      resolve();
    } else {
      handleNotAuthorized(res);
      reject();
    }
  })
}

let requireUserMiddleware = async (req, res, next) => {
  return new Promise(async (resolve, reject) => {
    res.locals.user = await User.findById(res.locals.token.userId).exec();

    if (res.locals.user) {
      resolve();
    } else {
      handleNotAuthorized(res);
      reject();
    }
  });
}

let requireTokenAndUserMiddleware = async (req, res, next) => {
  try {
    await requireTokenMiddleware(req, res);
    await requireUserMiddleware(req, res);

    next();
  } catch (err) {
    if (!res.headersSent) {
      handleError(err);
    }
  }
}

module.exports = {
  handleError,
  handleNotAuthorized,
  handleNotFound,
  requireTokenAndUserMiddleware,
};