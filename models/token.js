'use strict';

var mongoose = require('mongoose');
/*
UserSchema
firstName: String
lastName: String
email: String
password: String - to store a password follow best practices
addresses: [AddressSchema] - list of user’s addresses
createdAt: Date
isActive: Boolean by default true

AddressSchema
street: String
city: String
state: String
zip: String
country: String

TokenSchema
token: string
user: id of user
*/

let tokenSchema = new mongoose.Schema({
  userId: 'string',
  lastAccessedAt: 'date',
},
{
  timestamps: true,
});

let Token = mongoose.model('Token', tokenSchema);

module.exports = Token;