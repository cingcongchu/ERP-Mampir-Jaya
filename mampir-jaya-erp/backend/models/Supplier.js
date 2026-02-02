const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Supplier = sequelize.define('Supplier', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT
    },
    phone: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    }
  }, {
    timestamps: true
  });

  return Supplier;
};