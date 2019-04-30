'use strict';

let express = require('express');
let router = express.Router();
let Token = require('../models/token');
let User = require('../models/user');

let routeHelpers = require('./helpers');
const asyncHandler = require('express-async-handler');

/**
 * POST /tokens
 * 
 * Creates a new auth token
 */
router.post('/', asyncHandler(async (req, res) => {
  let u = await User.findByEmailAndPassword(req.body.email, req.body.password).exec();

  if (u) {
    let t = new Token({
      lastAccessedAt: new Date,
      userId: u._id,
    });

    await t.save();

    res.
      status(201).
      json({
        token: t._id,
        lastAccessedAt: t.lastAccessedAt,
        user: u.presentAsJson(),
      });
  } else {
    res.
      status(401).
      json({ error: 'Email or password unrecognized.' });
  }
}));

// Definitions below this line require a token and user.
router.use(routeHelpers.requireTokenAndUserMiddleware);

router.delete('/', asyncHandler(async (req, res) => {
  await Token.deleteOne({ _id: res.locals.token._id }).exec();

  res.
    status(204).
    end();
}));

module.exports = router;
