require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'mampir_jaya_erp',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: true,
      freezeTableName: true,
    }
  }
);

// Define models
const Product = require('./models/Product')(sequelize);
const Customer = require('./models/Customer')(sequelize);
const Supplier = require('./models/Supplier')(sequelize);
const { Sale, SaleItem } = require('./models/Sale')(sequelize);
const { Purchase, PurchaseItem } = require('./models/Purchase')(sequelize);

// Define associations
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

async function seedDatabase() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connected successfully');

    console.log('Dropping existing tables...');
    await sequelize.drop();
    console.log('Syncing database...');
    await sequelize.sync({ force: true }); // This will drop tables and recreate them
    console.log('Database synced successfully');

    console.log('Seeding products...');
    const products = await Product.bulkCreate([
      { name: 'Semen Portland', description: 'Semen berkualitas tinggi untuk konstruksi bangunan', category: 'Semen', price: 65000, stock: 150, unit: 'sak' },
      { name: 'Batu Bata Merah', description: 'Batu bata merah standar ukuran 10x20x5 cm', category: 'Batu Bata', price: 1200, stock: 5000, unit: 'pcs' },
      { name: 'Pasir Beton', description: 'Pasir berkualitas untuk campuran beton', category: 'Pasir', price: 280000, stock: 25, unit: 'm³' },
      { name: 'Besi Beton Polos Ø8mm', description: 'Besi beton polos diameter 8mm', category: 'Besi Beton', price: 195000, stock: 30, unit: 'batang' },
      { name: 'Besi Beton Ulir Ø10mm', description: 'Besi beton ulir diameter 10mm', category: 'Besi Beton', price: 250000, stock: 25, unit: 'batang' },
      { name: 'Cat Tembok Interior', description: 'Cat tembok interior anti jamur 5kg', category: 'Cat', price: 185000, stock: 45, unit: 'kaleng' },
      { name: 'Cat Tembok Eksterior', description: 'Cat tembok eksterior tahan cuaca 5kg', category: 'Cat', price: 210000, stock: 32, unit: 'kaleng' },
      { name: 'Keramik Lantai 40x40', description: 'Keramik lantai motif granite 40x40 cm', category: 'Keramik', price: 45000, stock: 200, unit: 'pcs' },
      { name: 'Pintu Kayu Jati', description: 'Pintu kayu jati ukuran 80x200 cm', category: 'Pintu', price: 850000, stock: 8, unit: 'pcs' },
      { name: 'Genteng Tanah Liat', description: 'Genteng tanah liat premium', category: 'Genteng', price: 850, stock: 1200, unit: 'pcs' },
      { name: 'Seng Gelombang', description: 'Seng galvanis gelombang 2.5mm', category: 'Seng', price: 125000, stock: 50, unit: 'lembar' },
      { name: 'Pipa PVC Ø4 inch', description: 'Pipa PVC diameter 4 inch untuk saluran air', category: 'Pipa', price: 45000, stock: 75, unit: 'batang' },
      { name: 'Kran Air', description: 'Kran air stainless steel', category: 'Sanitasi', price: 75000, stock: 30, unit: 'pcs' },
      { name: 'Triplek 12mm', description: 'Triplek kayu lapis tebal 12mm', category: 'Kayu', price: 185000, stock: 40, unit: 'lembar' },
      { name: 'Asbes Gelombang', description: 'Asbes gelombang untuk atap', category: 'Asbes', price: 95000, stock: 60, unit: 'lembar' },
      { name: 'Mortar Instan', description: 'Mortar instan untuk pemasangan bata', category: 'Mortar', price: 35000, stock: 80, unit: 'sak' },
      { name: 'Batu Split', description: 'Batu split untuk campuran beton', category: 'Batu', price: 180000, stock: 20, unit: 'm³' },
      { name: 'Batu Kali', description: 'Batu kali untuk pondasi', category: 'Batu', price: 220000, stock: 15, unit: 'm³' },
      { name: 'Semen Instan', description: 'Semen instan untuk berbagai keperluan', category: 'Semen', price: 55000, stock: 90, unit: 'sak' },
      { name: 'Cat Kayu', description: 'Cat khusus kayu 1 liter', category: 'Cat', price: 120000, stock: 28, unit: 'kaleng' }
    ]);

    console.log('Seeding customers...');
    const customers = await Customer.bulkCreate([
      { name: 'PT. Konstruksi Maju', address: 'Jl. Sudirman No. 123, Jakarta Pusat', phone: '021-5550123' },
      { name: 'CV. Bangun Rumah', address: 'Jl. Thamrin No. 45, Jakarta Selatan', phone: '021-5550456' },
      { name: 'Pak Budi Santoso', address: 'Jl. Merdeka No. 78, Bogor', phone: '08123456789' },
      { name: 'Ibu Siti Aminah', address: 'Jl. Raya Bogor No. 150, Depok', phone: '08134567890' },
      { name: 'PT. Properti Indonesia', address: 'Jl. Gatot Subroto No. 200, Jakarta', phone: '021-5550789' },
      { name: 'Toko Bangunan Sejahtera', address: 'Jl. Veteran No. 67, Bekasi', phone: '021-5550345' },
      { name: 'Pak Ahmad Ridwan', address: 'Jl. Diponegoro No. 89, Tangerang', phone: '08145678901' },
      { name: 'CV. Renovasi Modern', address: 'Jl. Pahlawan No. 112, Serang', phone: '0254-555123' },
      { name: 'Bu Dewi Kartika', address: 'Jl. Sudirman No. 234, Bandung', phone: '022-5550678' },
      { name: 'PT. Developer Nusantara', address: 'Jl. Asia Afrika No. 300, Bandung', phone: '022-5550890' }
    ]);

    console.log('Seeding suppliers...');
    const suppliers = await Supplier.bulkCreate([
      { name: 'PT. Semen Indonesia', address: 'Jl. Veteran No. 1, Gresik', phone: '031-5550123', email: 'sales@semenindonesia.com' },
      { name: 'CV. Batu Bata Merah', address: 'Jl. Raya Semarang No. 50, Semarang', phone: '024-5550456', email: 'batamerah@supplier.com' },
      { name: 'PT. Besi Beton Nusantara', address: 'Jl. Industri No. 75, Surabaya', phone: '031-5550789', email: 'besibeton@nusantara.com' },
      { name: 'CV. Cat & Bahan Bangunan', address: 'Jl. Ahmad Yani No. 120, Jakarta', phone: '021-5550345', email: 'catbangunan@cv.com' },
      { name: 'PT. Keramik Maju', address: 'Jl. Sudirman No. 300, Surakarta', phone: '0271-5550678', email: 'keramik@maju.com' },
      { name: 'CV. Kayu & Triplek', address: 'Jl. Veteran No. 45, Yogyakarta', phone: '0274-5550890', email: 'kayutriplek@cv.com' },
      { name: 'PT. Pipa PVC Indonesia', address: 'Jl. Industri No. 200, Cirebon', phone: '0231-5550123', email: 'pipapvc@indonesia.com' },
      { name: 'CV. Genteng & Atap', address: 'Jl. Raya Bandung No. 80, Bandung', phone: '022-5550456', email: 'genteng@atap.com' },
      { name: 'PT. Material Bangunan', address: 'Jl. Diponegoro No. 150, Medan', phone: '061-5550789', email: 'material@bangunan.com' },
      { name: 'CV. Distributor Bahan', address: 'Jl. Gatot Subroto No. 90, Palembang', phone: '0711-5550345', email: 'distributor@bahan.com' }
    ]);

    console.log('Seeding sales and sale items...');
    const sales = await Sale.bulkCreate([
      { invoiceNumber: 'INV-2024-001', total: 2750000, CustomerId: 1 },
      { invoiceNumber: 'INV-2024-002', total: 1580000, CustomerId: 2 },
      { invoiceNumber: 'INV-2024-003', total: 485000, CustomerId: 3 },
      { invoiceNumber: 'INV-2024-004', total: 920000, CustomerId: 4 },
      { invoiceNumber: 'INV-2024-005', total: 3450000, CustomerId: 5 },
      { invoiceNumber: 'INV-2024-006', total: 1250000, CustomerId: 6 },
      { invoiceNumber: 'INV-2024-007', total: 750000, CustomerId: 7 },
      { invoiceNumber: 'INV-2024-008', total: 2100000, CustomerId: 8 },
      { invoiceNumber: 'INV-2024-009', total: 1680000, CustomerId: 9 },
      { invoiceNumber: 'INV-2024-010', total: 4200000, CustomerId: 10 }
    ]);

    await SaleItem.bulkCreate([
      { quantity: 10, price: 65000, productId: 1, saleId: 1 },
      { quantity: 50, price: 1200, productId: 2, saleId: 1 },
      { quantity: 5, price: 280000, productId: 3, saleId: 1 },
      { quantity: 20, price: 195000, productId: 4, saleId: 2 },
      { quantity: 8, price: 185000, productId: 6, saleId: 2 },
      { quantity: 15, price: 45000, productId: 8, saleId: 3 },
      { quantity: 5, price: 75000, productId: 13, saleId: 3 },
      { quantity: 3, price: 850000, productId: 9, saleId: 4 },
      { quantity: 10, price: 850, productId: 10, saleId: 4 },
      { quantity: 8, price: 45000, productId: 12, saleId: 5 },
      { quantity: 12, price: 185000, productId: 14, saleId: 5 },
      { quantity: 25, price: 125000, productId: 11, saleId: 6 },
      { quantity: 6, price: 95000, productId: 15, saleId: 6 },
      { quantity: 20, price: 35000, productId: 16, saleId: 7 },
      { quantity: 15, price: 45000, productId: 8, saleId: 7 },
      { quantity: 40, price: 1200, productId: 2, saleId: 8 },
      { quantity: 10, price: 65000, productId: 1, saleId: 8 },
      { quantity: 30, price: 210000, productId: 7, saleId: 9 },
      { quantity: 8, price: 120000, productId: 20, saleId: 9 },
      { quantity: 50, price: 195000, productId: 4, saleId: 10 },
      { quantity: 25, price: 250000, productId: 5, saleId: 10 }
    ]);

    console.log('Seeding purchases and purchase items...');
    const purchases = await Purchase.bulkCreate([
      { purchaseOrder: 'PO-2024-001', total: 3250000, SupplierId: 1 },
      { purchaseOrder: 'PO-2024-002', total: 1800000, SupplierId: 2 },
      { purchaseOrder: 'PO-2024-003', total: 2450000, SupplierId: 3 },
      { purchaseOrder: 'PO-2024-004', total: 890000, SupplierId: 4 },
      { purchaseOrder: 'PO-2024-005', total: 2100000, SupplierId: 5 },
      { purchaseOrder: 'PO-2024-006', total: 1450000, SupplierId: 6 },
      { purchaseOrder: 'PO-2024-007', total: 980000, SupplierId: 7 },
      { purchaseOrder: 'PO-2024-008', total: 1680000, SupplierId: 8 },
      { purchaseOrder: 'PO-2024-009', total: 2250000, SupplierId: 9 },
      { purchaseOrder: 'PO-2024-010', total: 3100000, SupplierId: 10 }
    ]);

    await PurchaseItem.bulkCreate([
      { quantity: 50, price: 65000, ProductId: 1, PurchaseId: 1 },
      { quantity: 100, price: 1200, ProductId: 2, PurchaseId: 2 },
      { quantity: 15, price: 280000, ProductId: 3, PurchaseId: 2 },
      { quantity: 30, price: 195000, ProductId: 4, PurchaseId: 3 },
      { quantity: 20, price: 250000, ProductId: 5, PurchaseId: 3 },
      { quantity: 40, price: 185000, ProductId: 6, PurchaseId: 4 },
      { quantity: 25, price: 210000, ProductId: 7, PurchaseId: 4 },
      { quantity: 80, price: 45000, ProductId: 8, PurchaseId: 5 },
      { quantity: 10, price: 850000, ProductId: 9, PurchaseId: 5 },
      { quantity: 200, price: 850, ProductId: 10, PurchaseId: 6 },
      { quantity: 40, price: 125000, ProductId: 11, PurchaseId: 6 },
      { quantity: 60, price: 95000, ProductId: 15, PurchaseId: 7 },
      { quantity: 50, price: 35000, ProductId: 16, PurchaseId: 7 },
      { quantity: 25, price: 180000, ProductId: 17, PurchaseId: 8 },
      { quantity: 20, price: 220000, ProductId: 18, PurchaseId: 8 },
      { quantity: 70, price: 55000, ProductId: 19, PurchaseId: 9 },
      { quantity: 30, price: 120000, ProductId: 20, PurchaseId: 9 },
      { quantity: 40, price: 45000, ProductId: 12, PurchaseId: 10 },
      { quantity: 50, price: 75000, ProductId: 13, PurchaseId: 10 }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('📊 Summary:');
    console.log(`   - ${products.length} products created`);
    console.log(`   - ${customers.length} customers created`);
    console.log(`   - ${suppliers.length} suppliers created`);
    console.log(`   - ${sales.length} sales created`);
    console.log(`   - ${purchases.length} purchases created`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

seedDatabase();