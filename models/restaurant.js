'use strict';

var mongoose = require('mongoose');
let _ = require('lodash');

let itemSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, required: true },
  price:       { type: Number,  required: true, min: 0 },
  isActive:    { type: Boolean, required: true, default: true },
  dietaryRestrictions: [
    { type: String },
  ],
});

/**
 * Returns a JSON representation of this object, safe for returning to the end user.
 */
itemSchema.methods.presentAsJson = function() {
  return {
    id:                  this.id,
    isActive:            this.isActive,
    price:               this.price,
    dietaryRestrictions: this.dietaryRestrictions,
  };
};

let restaurantSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, required: true },
  isActive:    { type: Boolean, required: true, default: true },
  geo: {
    type:        { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  items: [ itemSchema ],
},
{
  // Making an explicit timestamp for created at, even though you
  // get that data for free with mongo. The ObjectId includes the
  // date and time it was created.
  timestamps: true,
});

restaurantSchema.index({ name: 1 });
restaurantSchema.index({ description: 1 });
restaurantSchema.index({ isActive: 1 });
restaurantSchema.index({ createdAt: 1 });
restaurantSchema.index({ createdAt: 1 });
restaurantSchema.index({ geo: "2dsphere" });
restaurantSchema.index({ "items.name": 1 });
restaurantSchema.index({ "items.isActive": 1 });
restaurantSchema.index({ "items.dietaryRestrictions": 1 });

/**
 * Santizes user input and creates a restaurant.
 */
restaurantSchema.statics.safeCreate = async function(params) {
  let safeParams = _.pick(params, [
    'name',
    'description',
    'longitude',
    'latitude',
  ]);

  Restaurant.convertLongitudeAndLatitudeToGeo(safeParams);

  return await this.create(safeParams);
};

restaurantSchema.statics.convertLongitudeAndLatitudeToGeo = function(params) {
  if (params.longitude && params.latitude) {
    params.geo = {
      type: "Point",
      coordinates: [
        Number(params.longitude),
        Number(params.latitude)
      ],
    }

    delete params.longitude;
    delete params.latitude;
  }
}

/**
 * Query helper that filters data with user input. The fields submitted
 * will be sanitized before passing to the database.
 * 
 * @param {object} params - Data to filter with
 */
restaurantSchema.query.safeWhere = function(params) {
  let safeParams = _.pick(params, [
    'name',
    'isActive',
    'longitude',
    'latitude',
    'maxDistance',
  ]);

  if (safeParams.longitude && safeParams.latitude) {
    let coords = [ Number(safeParams.longitude), Number(safeParams.latitude) ];
    let maxDistance = safeParams.maxDistance;

    delete safeParams.longitude;
    delete safeParams.latitude;
    delete safeParams.maxDistance;

    safeParams.geo = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: coords,
        },
        $maxDistance: Number(maxDistance),
      }
    }
  }

  return this.where(safeParams);
};

/**
 * Query helper that sorts data with user input. The fields submitted
 * will be sanitized before passing to the database.
 * 
 * @param {object} params - Data to sort by
 */
restaurantSchema.query.safeSort = function(params) {
  const whitelistForSortFields = [
    'name',
    'isActive',
    'createdAt',
    '_id',
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
 * Update's fields on a restaurant with the values passed in. Keys are first whitelisted.
 */
restaurantSchema.methods.safeUpdate = async function(params) {
  let safeParams = _.pick(params, [
    'name',
    'description',
    'isActive',
    'longitude',
    'latitude',
  ]);

  Restaurant.convertLongitudeAndLatitudeToGeo(safeParams);

  return await this.set(safeParams).save();
}


/**
 * Filter all the items a restaurant offers by the params passed in.
 * 
 * TODO:
 *   - Probably move this logic to the DB, at least I would if it was
 *     a relational data store.
 */
restaurantSchema.methods.filteredItems = function(filterParams) {
  if (filterParams.price) {
    filterParams.price = Number(filterParams.price);
  }

  return _.filter(this.items, (item) => {
    // Filter items that don't have the name the that the user asked for.
    if (filterParams.name && filterParams.name !== item.name) {
      return false;
    }

    // Filter items that are more expensive than the user asked for.
    if (!!filterParams.price && item.price > filterParams.price) {
      return false;
    }

    // Filter items that aren't appropriate given the dietary restrictions
    // that the user asked specified.
    if (filterParams.dietaryRestrictions) {
      let numberOfSpecifiedRestrictions = filterParams.dietaryRestrictions.length;
      let numberOfMatchedRestrictions = _.intersection(filterParams.dietaryRestrictions, item.dietaryRestrictions).length

      if (numberOfMatchedRestrictions != numberOfSpecifiedRestrictions) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Returns a JSON representation of this object, safe for returning to the end user.
 * 
 * TODO:
 *   - Should only be returning active items.
 */
restaurantSchema.methods.presentAsJson = function() {
  let items = this.items || [];

  return {
    id:          this._id,
    name:        this.name,
    description: this.description,
    coordinates: this.geo && this.geo.coordinates,
    isActive:    this.isActive,
    createdAt:   this.createdAt,
    items:       items.map((item) => { item.presentAsJson() }),
  };
}

let Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;