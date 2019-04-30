'use strict';

var mongoose = require('mongoose');
let _ = require('lodash');

let orderSchema = new mongoose.Schema({
  totalAmount:  { type: Number,  required: true, min: 0 },
  isPaid:       { type: Boolean, required: true, default: false },
  userId:       { type: String,  required: true },
  restaurantId: { type: String,  required: true },
  itemIds: [
    { type: String },
  ],
},
{
  timestamps: true,
});

orderSchema.index({ totalAmount: 1 });
orderSchema.index({ isPaid: 1 });
orderSchema.index({ userId: 1 });
orderSchema.index({ restaurantId: 1 });

/**
 * Santizes user input and creates an order.
 * 
 * @param {object} params - User params
 * 
 * TODO:
 *   - Actually make looking up the items work.
 */
orderSchema.statics.safeCreate = async function(params) {
  let safeParams = _.pick(params, [
    'userId',
    'restaurantId',
    'itemIds',
  ]);

  let restaurant  = Restaurant.find(safeParams.restaurantId)
  let items       = restaurant.items.find(safeParams.itemIds)
  let totalAmount = _.sumBy(itemIds, i => i.price)
  params.totalAmount = totalAmount;

  return await this.create(safeParams);
};

/**
 * Query helper that filters data with user input. The fields submitted
 * will be sanitized before passing to the database.
 * 
 * @param {object} params - Data to filter with
 */
orderSchema.query.safeWhere = function(params) {
  let safeParams = _.pick(params, [
    'totalAmount',
    'isPaid',
    'userId',
    'restaurantId',
  ]);

  return this.where(safeParams);
};

/**
 * Query helper that sorts data with user input. The fields submitted
 * will be sanitized before passing to the database.
 * 
 * @param {object} params - Data to sort by
 */
orderSchema.query.safeSort = function(params) {
  const whitelistForSortFields = [
    'totalAmount',
    'isPaid',
    'userId',
    'restaurantId',
    'createdAt',
  ];

  const whitelistForSortOrders = [
    'asc',
    'desc',
  ];

  let sortField = _.intersection(whitelistForSortFields, [params.sortField])[0] || '_id'; 
  let sortOrder = _.intersection(whitelistForSortOrders, [params.sortOrder])[0] || 'desc';

  return this.sort({
    [sortField]: sortOrder,
  });
};

/**
 * Returns a JSON representation of the order, safe for returning to the client.
 */
orderSchema.methods.presentAsJson = function() {
  let items = this.items || [];

  return {
    id:           this._id,
    totalAmount:  this.totalAmount,
    isPaid:       this.isPaid,
    userId:       this.userId,
    restaurantId: this.restaurantId,
    createdAt:    this.createdAt,
    items:        items,
  };
}

let Order = mongoose.model('Order', orderSchema);

module.exports = Order;