const express = require('express');
const router = express.Router();

module.exports = (sequelize) => {
  const { Sale, SaleItem } = require('../models/Sale')(sequelize);
  const Product = require('../models/Product')(sequelize);
  const Customer = require('../models/Customer')(sequelize);

  // GET all sales
  router.get('/', async (req, res) => {
    try {
      const sales = await Sale.findAll();
      res.json(sales);
    } catch (err) {
      console.error('Error fetching sales:', err);
      res.status(500).json({ message: err.message });
    }
  });

  // POST new sale
  router.post('/', async (req, res) => {
    try {
      // Generate invoice number
      const count = await Sale.count();
      const invoiceNumber = `INV-${(count + 1).toString().padStart(6, '0')}`;
      // Calculate total
      const total = req.body.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

      let CustomerId = req.body.customer;
      if (typeof CustomerId === 'string' && isNaN(CustomerId)) {
        let customer = await Customer.findOne({ where: { name: CustomerId } });
        if (!customer) {
          // Create new customer with provided details if available
          const customerData = { name: CustomerId };
          if (req.body.customerDetails) {
            customerData.address = req.body.customerDetails.address;
            customerData.phone = req.body.customerDetails.phone;
          }
          customer = await Customer.create(customerData);
        }
        CustomerId = customer.id;
      }

      const sale = await Sale.create({ CustomerId, invoiceNumber, total });
      // Create sale items
      for (const item of req.body.items) {
        let productId = item.product;
        if (typeof productId === 'string' && isNaN(productId)) {
          const product = await Product.findOne({ where: { name: productId } });
          if (!product) return res.status(400).json({ message: 'Product not found' });
          productId = product.id;
        }
        await SaleItem.create({ productId, quantity: item.quantity, price: item.price, saleId: sale.id });
        await require('../controllers/inventoryController').updateStock(Product, productId, -item.quantity);
      }
      res.status(201).json(sale);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // PUT update sale
  router.put('/:id', async (req, res) => {
    try {
      const [updated] = await Sale.update(req.body, { where: { id: req.params.id } });
      if (updated) {
        const updatedSale = await Sale.findByPk(req.params.id);
        res.json(updatedSale);
      } else {
        res.status(404).json({ message: 'Sale not found' });
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // DELETE sale
  router.delete('/:id', async (req, res) => {
    try {
      const deleted = await Sale.destroy({ where: { id: req.params.id } });
      if (deleted) {
        res.json({ message: 'Sale deleted' });
      } else {
        res.status(404).json({ message: 'Sale not found' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // GET sales with customer info
  router.get('/with-details', async (req, res) => {
    try {
      const sales = await Sale.findAll();
      const salesWithDetails = await Promise.all(sales.map(async (sale) => {
        const customer = await Customer.findByPk(sale.CustomerId);
        const saleItemsData = await SaleItem.findAll({ where: { saleId: sale.id } });

        // Manual join with products
        const saleItems = await Promise.all(saleItemsData.map(async (item) => {
          const product = await Product.findByPk(item.productId);
          return {
            ...item.toJSON(),
            Product: product ? product.toJSON() : null
          };
        }));

        return {
          ...sale.toJSON(),
          Customer: customer ? customer.toJSON() : null,
          SaleItems: saleItems
        };
      }));
      res.json(salesWithDetails);
    } catch (err) {
      console.error('Error fetching sales with details:', err);
      res.status(500).json({ message: err.message });
    }
  });

  return router;
};