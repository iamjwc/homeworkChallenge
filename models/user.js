'use strict';

var mongoose = require('mongoose');
let _ = require('lodash');

let addressSchema = new mongoose.Schema({
  street: 'string',
  city: 'string',
  state: 'string',
  zip: 'string',
  country: 'string',
});

let userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true },
  password:  { type: String, required: true },
  addresses: [addressSchema],
},
{
  // Making an explicit timestamp for created at, even though you
  // get that data for free with mongo. The ObjectId includes the
  // date and time it was created.
  timestamps: true,
});

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ firstName: 1 });
userSchema.index({ lastName: 1 });
userSchema.index({ createdAt: 1 });

/**
 * Attempts to find a user in the database by email and password.
 * 
 * TODO:
 *   - Hash the password passed in and search for that hashed password
 *     in the db. Never use the actual password.
 * 
 * @param {string} email - User's email
 */
userSchema.statics.findByEmailAndPassword = function(email, password) {
  return this.findOne({
    email: email,
    password: password,
  });
};

/**
 * Santizes user input and creates a user.
 * 
 * TODO:
 *   - Hash password
 * 
 * @param {object} params - User params
 */
userSchema.statics.safeCreate = async function(params) {
  let safeParams = _.pick(params, [
    'firstName',
    'lastName',
    'email',
    'password',
    'addresses',
  ]);

  return await this.create(safeParams);
};

/**
 * Query helper that filters data with user input. The fields submitted
 * will be sanitized before passing to the database.
 * 
 * @param {object} params - Data to filter with
 */
userSchema.query.safeWhere = function(params) {
  let safeParams = _.pick(params, [
    'firstName',
    'lastName',
    'email',
  ]);

  return this.where(safeParams);
};

/**
 * Query helper that sorts data with user input. The fields submitted
 * will be sanitized before passing to the database.
 * 
 * @param {object} params - Data to sort by
 */
userSchema.query.safeSort = function(params) {
  const whitelistForSortFields = [
    'firstName',
    'lastName',
    'email',
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
 * Update's fields on a user with the values passed in. Keys are first whitelisted.
 */
userSchema.methods.safeUpdate = async function(params) {
  let safeParams = _.pick(params, [
    'firstName',
    'lastName',
    'email',
    'createdAt',
    'password',
  ]);

  return await this.set(safeParams).save();
}

/**
 * Returns a JSON representation of this object, safe for returning to the end user.
 */
userSchema.methods.presentAsJson = function() {
  let addresses = this.addresses || [];

  return {
    id:        this._id,
    email:     this.email,
    firstName: this.firstName,
    lastName:  this.lastName,
    createdAt: this.createdAt,
    addresses: addresses.map((address) => {
      return {
        id:      address._id,
        street:  address.street,
        city:    address.city,
        state:   address.state,
        zip:     address.zip,
        country: address.country,
      };
    }),
  };
}

let User = mongoose.model('User', userSchema);

module.exports = User;