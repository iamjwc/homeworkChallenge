'use strict';

let express = require('express');
let router = express.Router();
let User = require('../models/user');
let routeHelpers = require('./helpers');
let _ = require('lodash');
const asyncHandler = require('express-async-handler');
 
/**
 * POST /users/:id
 * 
 * Returns newly created user's data
 */
router.post('/', asyncHandler(async (req, res) => {
  let u;
  try {
    u = await User.safeCreate(req.body);
  } catch(err) {
    if (err.name === 'MongoError' && err.message.match(/duplicate key/)) {
      res.
        status(400).
        json({ error: "Email address is already in use." });
    } else {
      throw error;
    }
    return;
  }

  res.
    status(201).
    json({
      user: u.presentAsJson()
    });
}));

// Definitions below this line require a token and user.
router.use(routeHelpers.requireTokenAndUserMiddleware);

/**
 * GET /users?firstName=Justin&lastName=Camerer&sortField=email&sortOrder=asc
 * 
 * Returns all users that match search fields.
 * 
 * TODO:
 *  - paginate results
 */
router.get('/', asyncHandler(async (req, res) => {
  let query = User.
    find().
    safeWhere(req.query).
    safeSort(req.query);

  let users = await query.exec();
  res.json({
    users: users.map((u) => {
      return u.presentAsJson();
    }),
  });
}));

/**
 * GET /users/:id
 * 
 * Returns a single user's data
 */
router.get('/:id', asyncHandler(async (req, res) => {
  let u = await User.findById(req.params.id).exec();

  if (u) {
    res.json({
      user: u.presentAsJson()
    });
  } else {
    routeHelpers.handleNotFound(res);
  }
}));

/**
 *) PUT /users/:id
 * 
 * Update's a single user.
 */
router.put('/:id', asyncHandler(async (req, res) => {
  let u = await User.findById(req.params.id).exec();

  if (u) {
    u.safeUpdate(req.body);

    res.json({
      user: u.presentAsJson(),
    });
  } else {
    routeHelpers.handleNotFound(res);
  }
}));

/**
 * DELETE /users/:id
 * 
 * Deletes a user
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  await User.deleteOne({ _id: req.params.id });

  res.
    status(204).
    end();
}));

/**
 * POST /users/:id/addresses
 * 
 * Pushes an address onto the User's addresses.
 */
router.post('/:id/addresses', asyncHandler(async (req, res) => {
  let u = await User.findById(req.params.id).exec();

  if (u) {
    u.addresses.push(req.body);
    await u.save();

    res.json({
      user: u.presentAsJson(),
    });
  } else {
    routeHelpers.handleNotFound(res);
    return;
  }
}));

/**
 * DELETE /users/:id/addresses/:addressId
 * 
 * Pushes an address onto the User's addresses.
 */
router.delete('/:id/addresses/:addressId', asyncHandler(async (req, res) => {
  let u = await User.findById(req.params.id).exec();

  if (u) {
    u.addresses.id(req.params.addressId).remove();
    await u.save();

    res.
      status(204).
      end();
  } else {
    routeHelpers.handleNotFound(res);
    return
  }
}));

module.exports = router;
