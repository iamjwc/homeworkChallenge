'use strict';

let express = require('express');
let router = express.Router();
let Order = require('../models/order');
let routeHelpers = require('./helpers');
let _ = require('lodash');
const asyncHandler = require('express-async-handler');

// Definitions below this line require a token and user.
router.use(routeHelpers.requireTokenAndUserMiddleware);

/**
 * POST /orders/:id
 * 
 * Returns the newly created order
 */
router.post('/', asyncHandler(async (req, res) => {
  let params = req.body;
  params.userId = res.locals.user.id;

  let o = await Order.safeCreate(params);

  /*
    Do something like charge the user and then set o.isPaid=true if the charge succeeds
  */

  res.
    status(201).
    json({
      order: o.presentAsJson()
    });
}));

/**
 * GET /orders?userId=1234567890&restaurantId=0987654321&sortField=totalAmount&sortOrder=asc
 * 
 * Returns all orders that match search fields.
 * 
 * TODO:
 *  - paginate results
 */
router.get('/', asyncHandler(async (req, res) => {
  let query = Order.
    find().
    safeWhere(req.query).
    safeSort(req.query);

  let orders = await query.exec();
  res.json({
    orders: orders.map((o) => {
      return o.presentAsJson();
    }),
  });
}));

/**
 * GET /orders/:id
 * 
 * Returns a single order's data
 */
router.get('/:id', asyncHandler(async (req, res) => {
  let o = await Order.findById(req.params.id).exec();

  if (o) {
    res.json({
      order: o.presentAsJson()
    });
  } else {
    routeHelpers.handleNotFound(res);
  }
}));

module.exports = router;
