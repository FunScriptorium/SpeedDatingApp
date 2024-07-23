// models/userEvent.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const UserEvent = sequelize.define('UserEvent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  EventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Events',
      key: 'id'
    }
  },
  choice: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'UserEvents',
  timestamps: true,
});

module.exports = UserEvent;