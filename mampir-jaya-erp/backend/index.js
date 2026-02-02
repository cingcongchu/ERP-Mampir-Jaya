require('dotenv').config();
const express = require('express');
const { Sequelize } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Test route - place this BEFORE database connection
app.get('/test', (req, res) => {
  console.log('Test route accessed');
  res.json({ message: 'API is working', timestamp: new Date() });
});

app.get('/api/test', (req, res) => {
  console.log('API test route accessed');
  res.json({ message: 'API test is working', timestamp: new Date() });
});

// Debug route
app.get('/debug', async (req, res) => {
  try {
    const sales = await Sale.findAll({ raw: true });
    const customers = await Customer.findAll({ raw: true });
    const salesWithInclude = await Sale.findAll({
      include: [{ model: Customer }]
    });
    res.json({
      sales: sales,
      customers: customers,
      salesWithInclude: salesWithInclude
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// Connect to MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME || 'mampir_jaya_erp',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: console.log,
    define: {
      timestamps: true,
      freezeTableName: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 20000
    }
  }
);

// Sync database
sequelize.sync({ force: false })
  .then(() => console.log('Database synced'))
  .catch(err => console.log('Database sync error:', err));

sequelize.authenticate()
  .then(() => console.log('MySQL connected'))
  .catch(err => console.log('MySQL connection error:', err));

// Define models
const Product = require('./models/Product')(sequelize);
const Customer = require('./models/Customer')(sequelize);
const Supplier = require('./models/Supplier')(sequelize);
const { Sale, SaleItem } = require('./models/Sale')(sequelize);
const { SalesOrder, SalesOrderItem } = require('./models/SalesOrder')(sequelize);
const { Purchase, PurchaseItem } = require('./models/Purchase')(sequelize);

// Test models
console.log('Sale model tableName:', Sale.getTableName());
console.log('Customer model tableName:', Customer.getTableName());

// Define associations after models are loaded
Customer.hasMany(Sale, { foreignKey: 'CustomerId' });
Sale.belongsTo(Customer, { foreignKey: 'CustomerId' });

Product.hasMany(SaleItem, { foreignKey: 'productId' });
SaleItem.belongsTo(Product, { foreignKey: 'productId' });

Sale.hasMany(SaleItem, { foreignKey: 'saleId' });
SaleItem.belongsTo(Sale, { foreignKey: 'saleId' });

Supplier.hasMany(Purchase);
Purchase.belongsTo(Supplier);
Product.hasMany(PurchaseItem);
PurchaseItem.belongsTo(Product);

// Routes
app.use('/api/products', require('./routes/productRoutes')(sequelize));
app.use('/api/customers', require('./routes/customerRoutes')(sequelize));
app.use('/api/suppliers', require('./routes/supplierRoutes')(sequelize));
app.use('/api/sales', require('./routes/saleRoutes')(sequelize));
app.use('/api/purchases', require('./routes/purchaseRoutes')(sequelize));





const PORT = 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available routes:');
  console.log('  GET /test');
  console.log('  GET /api/test');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});