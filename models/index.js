// models/index.js
const User = require('./user');
const Event = require('./event');
const UserEvent = require('./userEvent');
const defineAssociations = require('./associations');

defineAssociations();

module.exports = {
  User,
  Event,
  UserEvent
};