const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Purchase = sequelize.define('Purchase', {
    purchaseOrder: {
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

  const PurchaseItem = sequelize.define('PurchaseItem', {
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

  // Define associations
  Purchase.hasMany(PurchaseItem, { foreignKey: 'purchaseId' });
  PurchaseItem.belongsTo(Purchase, { foreignKey: 'purchaseId' });

  return { Purchase, PurchaseItem };
};