const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Photo = sequelize.define('Photo', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  photo: {
    type: DataTypes.STRING, // Path to the photo file
    allowNull: false,
  },
});

module.exports = Photo;
