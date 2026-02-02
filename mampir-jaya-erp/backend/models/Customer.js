const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Customer = sequelize.define('Customer', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT
    },
    phone: {
      type: DataTypes.STRING
    }
  }, {
    timestamps: true
  });

  return Customer;
};