'use strict';

let express = require('express');
let router = express.Router();
let Restaurant = require('../models/restaurant');
let routeHelpers = require('./helpers');
let _ = require('lodash');
const asyncHandler = require('express-async-handler');

// Definitions below this line require a token and user.
router.use(routeHelpers.requireTokenAndUserMiddleware);

/**
 * POST /restaurants/:id
 * 
 * Returns the newly created order
 */
router.post('/', asyncHandler(async (req, res) => {
  let r = await Restaurant.safeCreate(req.body);

  res.
    status(201).
    json({
      restaurant: r.presentAsJson()
    });
}));

/**
 * GET /restaurants?name=Ippudo&latitude=40.7312261&longitude=-73.9888796&maxDistance=1
 * 
 * Returns all restaurants that match search fields.
 * 
 * TODO:
 *  - paginate results
 */
router.get('/', asyncHandler(async (req, res) => {
  let query = Restaurant.
    find().
    safeWhere(req.query).
    safeSort(req.query);

  let restaurants = await query.exec();
  res.json({
    restaurants: restaurants.map((r) => {
      return r.presentAsJson();
    }),
  });
}));

/**
 * GET /restaurants/:id
 * 
 * Returns a single restaurant's data
 */
router.get('/:id', asyncHandler(async (req, res) => {
  let r = await Restaurant.findById(req.params.id).exec();

  if (r) {
    res.json({
      restaurant: r.presentAsJson()
    });
  } else {
    routeHelpers.handleNotFound(res);
  }
}));

/**
 *) PUT /restaurants/:id
 * 
 * Update's a single restaurant.
 */
router.put('/:id', asyncHandler(async (req, res) => {
  let r = await Restaurant.findById(req.params.id).exec();

  if (r) {
    r.safeUpdate(req.body);

    res.json({
      restaurant: r.presentAsJson(),
    });
  } else {
    routeHelpers.handleNotFound(res);
  }
}));

/**
 * GET /restaurants/:id/items?dietaryRestrictions[]=carnivore
 * 
 * Returns all items from a restaurant that match search fields.
 * 
 * TODO:
 *  - paginate results
 *  - validate that the index for dietaryRestrictions works as expected
 */
router.get('/:id/items', asyncHandler(async (req, res) => {
  let r = await Restaurant.findById(req.params.id).exec();

  if (r) {
    res.json({
      items: r.filteredItems(req.query || {}).map((i) => {
        return i.presentAsJson();
      }),
    });
  } else {
    routeHelpers.handleNotFound(res);
  }
}));

/**
 * POST /restaurants/:id/items
 * 
 * Pushes an items onto the Restaurant's items array.
 */
router.post('/:id/items', asyncHandler(async (req, res) => {
  let r = await Restaurant.findById(req.params.id).exec();

  if (r) {
    r.items.push(req.body);
    await r.save();

    res.json({
      items: r.items.map((i) => {
        return i.presentAsJson();
      }),
    });
  } else {
    routeHelpers.handleNotFound(res);
  }
}));

/**
 * DELETE /restaurants/:id/items/:itemId
 * 
 * Removes an item from the restaurant's menu.
 * 
 * TODO:
 *   - use isActive (or even better, deletedAt) to delete instead of hard deleting
 *     because orders will reference these items.
 */
router.delete('/:id/items/:itemId', asyncHandler(async (req, res) => {
  let r = await Restaurant.findById(req.params.id).exec();

  if (r) {
    r.items.pull(req.params.itemId);
    await r.save();

    res.
      status(204).
      end();
  } else {
    routeHelpers.handleNotFound(res);
  }
}));


module.exports = router;
