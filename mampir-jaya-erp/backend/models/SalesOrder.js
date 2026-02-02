module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');

  const SalesOrder = sequelize.define('SalesOrder', {
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    orderNumber: {
      type: DataTypes.STRING,
      unique: true,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'invoiced'),
      defaultValue: 'pending',
    },
  }, {
    timestamps: true,
  });

  const SalesOrderItem = sequelize.define('SalesOrderItem', {
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    salesOrderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    timestamps: true,
  });

  SalesOrder.associate = (models) => {
    SalesOrder.belongsTo(models.Customer, { foreignKey: 'customerId' });
    SalesOrder.hasMany(models.SalesOrderItem, { foreignKey: 'salesOrderId' });
  };

  SalesOrderItem.associate = (models) => {
    SalesOrderItem.belongsTo(models.Product, { foreignKey: 'productId' });
    SalesOrderItem.belongsTo(models.SalesOrder, { foreignKey: 'salesOrderId' });
  };

  return { SalesOrder, SalesOrderItem };
};