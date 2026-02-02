const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Sale = sequelize.define('Sale', {
    CustomerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    invoiceNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    timestamps: true
  });

  const SaleItem = sequelize.define('SaleItem', {
    saleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    timestamps: true
  });

  return { Sale, SaleItem };
};