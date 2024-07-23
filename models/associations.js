// models/associations.js
const Event = require('./event');
const User = require('./user');
const UserEvent = require('./userEvent');

const defineAssociations = () => {
    Event.belongsToMany(User, { through: UserEvent });
    User.belongsToMany(Event, { through: UserEvent });
};

module.exports = defineAssociations;