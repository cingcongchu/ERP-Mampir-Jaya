const express = require('express');
const router = express.Router();

module.exports = (sequelize) => {
  const { Purchase, PurchaseItem } = require('../models/Purchase')(sequelize);
  const Product = require('../models/Product')(sequelize);
  const Supplier = require('../models/Supplier')(sequelize);

  // GET all purchases
  router.get('/', async (req, res) => {
    try {
      const purchases = await Purchase.findAll();
      res.json(purchases);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // POST new purchase
  router.post('/', async (req, res) => {
    try {
      // Generate purchase order
      const count = await Purchase.count();
      const purchaseOrder = `PO-${(count + 1).toString().padStart(6, '0')}`;
      // Calculate total
      const total = req.body.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

      const purchase = await Purchase.create({ supplierId: req.body.supplier, purchaseOrder, total });
      // Create purchase items
      for (const item of req.body.items) {
        await PurchaseItem.create({ ...item, purchaseId: purchase.id });
        await require('../controllers/inventoryController').updateStock(Product, item.product, item.quantity);
      }
      res.status(201).json(purchase);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // PUT update purchase
  router.put('/:id', async (req, res) => {
    try {
      const [updated] = await Purchase.update(req.body, { where: { id: req.params.id } });
      if (updated) {
        const updatedPurchase = await Purchase.findByPk(req.params.id);
        res.json(updatedPurchase);
      } else {
        res.status(404).json({ message: 'Purchase not found' });
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // DELETE purchase
  router.delete('/:id', async (req, res) => {
    try {
      const deleted = await Purchase.destroy({ where: { id: req.params.id } });
      if (deleted) {
        res.json({ message: 'Purchase deleted' });
      } else {
        res.status(404).json({ message: 'Purchase not found' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  return router;
};