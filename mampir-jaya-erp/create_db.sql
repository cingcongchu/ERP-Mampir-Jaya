CREATE DATABASE IF NOT EXISTS mampir_jaya_erp;

USE mampir_jaya_erp;

-- Create Products table
CREATE TABLE IF NOT EXISTS Products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  unit VARCHAR(50) DEFAULT 'pcs',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Customers table
CREATE TABLE IF NOT EXISTS Customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Suppliers table
CREATE TABLE IF NOT EXISTS Suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Sales table
CREATE TABLE IF NOT EXISTS Sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoiceNumber VARCHAR(255) UNIQUE NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  customerId INT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customerId) REFERENCES Customers(id)
);

-- Create SaleItems table
CREATE TABLE IF NOT EXISTS SaleItems (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  productId INT NOT NULL,
  saleId INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (productId) REFERENCES Products(id),
  FOREIGN KEY (saleId) REFERENCES Sales(id)
);

-- Create Purchases table
CREATE TABLE IF NOT EXISTS Purchases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  purchaseOrder VARCHAR(255) UNIQUE NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  supplierId INT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (supplierId) REFERENCES Suppliers(id)
);

-- Create PurchaseItems table
CREATE TABLE IF NOT EXISTS PurchaseItems (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  productId INT NOT NULL,
  purchaseId INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (productId) REFERENCES Products(id),
  FOREIGN KEY (purchaseId) REFERENCES Purchases(id)
);

-- Insert dummy data for Products (bahan bangunan)
INSERT INTO Products (name, description, category, price, stock, unit, createdAt, updatedAt) VALUES
('Semen Portland', 'Semen berkualitas tinggi untuk konstruksi bangunan', 'Semen', 65000, 150, 'sak', NOW(), NOW()),
('Batu Bata Merah', 'Batu bata merah standar ukuran 10x20x5 cm', 'Batu Bata', 1200, 5000, 'pcs', NOW(), NOW()),
('Pasir Beton', 'Pasir berkualitas untuk campuran beton', 'Pasir', 280000, 25, 'm³', NOW(), NOW()),
('Besi Beton Polos Ø8mm', 'Besi beton polos diameter 8mm', 'Besi Beton', 195000, 30, 'batang', NOW(), NOW()),
('Besi Beton Ulir Ø10mm', 'Besi beton ulir diameter 10mm', 'Besi Beton', 250000, 25, 'batang', NOW(), NOW()),
('Cat Tembok Interior', 'Cat tembok interior anti jamur 5kg', 'Cat', 185000, 45, 'kaleng', NOW(), NOW()),
('Cat Tembok Eksterior', 'Cat tembok eksterior tahan cuaca 5kg', 'Cat', 210000, 32, 'kaleng', NOW(), NOW()),
('Keramik Lantai 40x40', 'Keramik lantai motif granite 40x40 cm', 'Keramik', 45000, 200, 'pcs', NOW(), NOW()),
('Pintu Kayu Jati', 'Pintu kayu jati ukuran 80x200 cm', 'Pintu', 850000, 8, 'pcs', NOW(), NOW()),
('Genteng Tanah Liat', 'Genteng tanah liat premium', 'Genteng', 850, 1200, 'pcs', NOW(), NOW()),
('Seng Gelombang', 'Seng galvanis gelombang 2.5mm', 'Seng', 125000, 50, 'lembar', NOW(), NOW()),
('Pipa PVC Ø4 inch', 'Pipa PVC diameter 4 inch untuk saluran air', 'Pipa', 45000, 75, 'batang', NOW(), NOW()),
('Kran Air', 'Kran air stainless steel', 'Sanitasi', 75000, 30, 'pcs', NOW(), NOW()),
('Triplek 12mm', 'Triplek kayu lapis tebal 12mm', 'Kayu', 185000, 40, 'lembar', NOW(), NOW()),
('Asbes Gelombang', 'Asbes gelombang untuk atap', 'Asbes', 95000, 60, 'lembar', NOW(), NOW()),
('Mortar Instan', 'Mortar instan untuk pemasangan bata', 'Mortar', 35000, 80, 'sak', NOW(), NOW()),
('Batu Split', 'Batu split untuk campuran beton', 'Batu', 180000, 20, 'm³', NOW(), NOW()),
('Batu Kali', 'Batu kali untuk pondasi', 'Batu', 220000, 15, 'm³', NOW(), NOW()),
('Semen Instan', 'Semen instan untuk berbagai keperluan', 'Semen', 55000, 90, 'sak', NOW(), NOW()),
('Cat Kayu', 'Cat khusus kayu 1 liter', 'Cat', 120000, 28, 'kaleng', NOW(), NOW());

-- Insert dummy data for Customers
INSERT INTO Customers (name, address, phone, email, createdAt, updatedAt) VALUES
('PT. Konstruksi Maju', 'Jl. Sudirman No. 123, Jakarta Pusat', '021-5550123', 'info@konstruksimaju.com', NOW(), NOW()),
('CV. Bangun Rumah', 'Jl. Thamrin No. 45, Jakarta Selatan', '021-5550456', 'contact@bangunrumah.com', NOW(), NOW()),
('Pak Budi Santoso', 'Jl. Merdeka No. 78, Bogor', '08123456789', 'budisantoso@gmail.com', NOW(), NOW()),
('Ibu Siti Aminah', 'Jl. Raya Bogor No. 150, Depok', '08134567890', 'sitiaminah@yahoo.com', NOW(), NOW()),
('PT. Properti Indonesia', 'Jl. Gatot Subroto No. 200, Jakarta', '021-5550789', 'admin@propertiindo.com', NOW(), NOW()),
('Toko Bangunan Sejahtera', 'Jl. Veteran No. 67, Bekasi', '021-5550345', 'sejahtera@toko.com', NOW(), NOW()),
('Pak Ahmad Ridwan', 'Jl. Diponegoro No. 89, Tangerang', '08145678901', 'ahmad.ridwan@gmail.com', NOW(), NOW()),
('CV. Renovasi Modern', 'Jl. Pahlawan No. 112, Serang', '0254-555123', 'modern@renovasi.com', NOW(), NOW()),
('Bu Dewi Kartika', 'Jl. Sudirman No. 234, Bandung', '022-5550678', 'dewikartika@gmail.com', NOW(), NOW()),
('PT. Developer Nusantara', 'Jl. Asia Afrika No. 300, Bandung', '022-5550890', 'info@developnusantara.com', NOW(), NOW());

-- Insert dummy data for Suppliers
INSERT INTO Suppliers (name, address, phone, email, createdAt, updatedAt) VALUES
('PT. Semen Indonesia', 'Jl. Veteran No. 1, Gresik', '031-5550123', 'sales@semenindonesia.com', NOW(), NOW()),
('CV. Batu Bata Merah', 'Jl. Raya Semarang No. 50, Semarang', '024-5550456', 'batamerah@supplier.com', NOW(), NOW()),
('PT. Besi Beton Nusantara', 'Jl. Industri No. 75, Surabaya', '031-5550789', 'besibeton@nusantara.com', NOW(), NOW()),
('CV. Cat & Bahan Bangunan', 'Jl. Ahmad Yani No. 120, Jakarta', '021-5550345', 'catbangunan@cv.com', NOW(), NOW()),
('PT. Keramik Maju', 'Jl. Sudirman No. 300, Surakarta', '0271-5550678', 'keramik@maju.com', NOW(), NOW()),
('CV. Kayu & Triplek', 'Jl. Veteran No. 45, Yogyakarta', '0274-5550890', 'kayutriplek@cv.com', NOW(), NOW()),
('PT. Pipa PVC Indonesia', 'Jl. Industri No. 200, Cirebon', '0231-5550123', 'pipapvc@indonesia.com', NOW(), NOW()),
('CV. Genteng & Atap', 'Jl. Raya Bandung No. 80, Bandung', '022-5550456', 'genteng@atap.com', NOW(), NOW()),
('PT. Material Bangunan', 'Jl. Diponegoro No. 150, Medan', '061-5550789', 'material@bangunan.com', NOW(), NOW()),
('CV. Distributor Bahan', 'Jl. Gatot Subroto No. 90, Palembang', '0711-5550345', 'distributor@bahan.com', NOW(), NOW());

-- Insert dummy data for Sales
INSERT INTO Sales (invoiceNumber, total, customerId, createdAt, updatedAt) VALUES
('INV-2024-001', 2750000, 1, NOW(), NOW()),
('INV-2024-002', 1580000, 2, NOW(), NOW()),
('INV-2024-003', 485000, 3, NOW(), NOW()),
('INV-2024-004', 920000, 4, NOW(), NOW()),
('INV-2024-005', 3450000, 5, NOW(), NOW()),
('INV-2024-006', 1250000, 6, NOW(), NOW()),
('INV-2024-007', 750000, 7, NOW(), NOW()),
('INV-2024-008', 2100000, 8, NOW(), NOW()),
('INV-2024-009', 1680000, 9, NOW(), NOW()),
('INV-2024-010', 4200000, 10, NOW(), NOW());

-- Insert dummy data for SaleItems
INSERT INTO SaleItems (quantity, price, productId, saleId, createdAt, updatedAt) VALUES
(10, 65000, 1, 1, NOW(), NOW()),
(50, 1200, 2, 1, NOW(), NOW()),
(5, 280000, 3, 1, NOW(), NOW()),
(20, 195000, 4, 2, NOW(), NOW()),
(8, 185000, 6, 2, NOW(), NOW()),
(15, 45000, 8, 3, NOW(), NOW()),
(5, 75000, 13, 3, NOW(), NOW()),
(3, 850000, 9, 4, NOW(), NOW()),
(10, 850, 10, 4, NOW(), NOW()),
(8, 45000, 12, 5, NOW(), NOW()),
(12, 185000, 14, 5, NOW(), NOW()),
(25, 125000, 11, 6, NOW(), NOW()),
(6, 95000, 15, 6, NOW(), NOW()),
(20, 35000, 16, 7, NOW(), NOW()),
(15, 45000, 8, 7, NOW(), NOW()),
(40, 1200, 2, 8, NOW(), NOW()),
(10, 65000, 1, 8, NOW(), NOW()),
(30, 210000, 7, 9, NOW(), NOW()),
(8, 120000, 20, 9, NOW(), NOW()),
(50, 195000, 4, 10, NOW(), NOW()),
(25, 250000, 5, 10, NOW(), NOW());

-- Insert dummy data for Purchases
INSERT INTO Purchases (purchaseOrder, total, supplierId, createdAt, updatedAt) VALUES
('PO-2024-001', 3250000, 1, NOW(), NOW()),
('PO-2024-002', 1800000, 2, NOW(), NOW()),
('PO-2024-003', 2450000, 3, NOW(), NOW()),
('PO-2024-004', 890000, 4, NOW(), NOW()),
('PO-2024-005', 2100000, 5, NOW(), NOW()),
('PO-2024-006', 1450000, 6, NOW(), NOW()),
('PO-2024-007', 980000, 7, NOW(), NOW()),
('PO-2024-008', 1680000, 8, NOW(), NOW()),
('PO-2024-009', 2250000, 9, NOW(), NOW()),
('PO-2024-010', 3100000, 10, NOW(), NOW());

-- Insert dummy data for PurchaseItems
INSERT INTO PurchaseItems (quantity, price, productId, purchaseId, createdAt, updatedAt) VALUES
(50, 65000, 1, 1, NOW(), NOW()),
(100, 1200, 2, 2, NOW(), NOW()),
(15, 280000, 3, 2, NOW(), NOW()),
(30, 195000, 4, 3, NOW(), NOW()),
(20, 250000, 5, 3, NOW(), NOW()),
(40, 185000, 6, 4, NOW(), NOW()),
(25, 210000, 7, 4, NOW(), NOW()),
(80, 45000, 8, 5, NOW(), NOW()),
(10, 850000, 9, 5, NOW(), NOW()),
(200, 850, 10, 6, NOW(), NOW()),
(40, 125000, 11, 6, NOW(), NOW()),
(60, 95000, 15, 7, NOW(), NOW()),
(50, 35000, 16, 7, NOW(), NOW()),
(25, 180000, 17, 8, NOW(), NOW()),
(20, 220000, 18, 8, NOW(), NOW()),
(70, 55000, 19, 9, NOW(), NOW()),
(30, 120000, 20, 9, NOW(), NOW()),
(40, 45000, 12, 10, NOW(), NOW()),
(50, 75000, 13, 10, NOW(), NOW());