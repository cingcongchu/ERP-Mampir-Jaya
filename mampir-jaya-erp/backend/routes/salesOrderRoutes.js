const express = require('express');
const router = express.Router();

module.exports = (sequelize) => {
  const { SalesOrder, SalesOrderItem } = require('../models/SalesOrder')(sequelize);
  const Product = require('../models/Product')(sequelize);
  const Customer = require('../models/Customer')(sequelize);

  // GET all sales orders
  router.get('/', async (req, res) => {
    try {
      const orders = await SalesOrder.findAll({
        include: [
          { model: Customer },
          { model: SalesOrderItem, include: [{ model: Product }] }
        ]
      });
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // POST new sales order
  router.post('/', async (req, res) => {
    try {
      const count = await SalesOrder.count();
      const orderNumber = `SO-${(count + 1).toString().padStart(6, '0')}`;
      const total = req.body.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

      const order = await SalesOrder.create({ customerId: req.body.customer, orderNumber, total });
      for (const item of req.body.items) {
        await SalesOrderItem.create({ ...item, salesOrderId: order.id });
      }
      res.status(201).json(order);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // PUT update sales order
  router.put('/:id', async (req, res) => {
    try {
      const [updated] = await SalesOrder.update(req.body, { where: { id: req.params.id } });
      if (updated) {
        const updatedOrder = await SalesOrder.findByPk(req.params.id);
        res.json(updatedOrder);
      } else {
        res.status(404).json({ message: 'Sales order not found' });
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // DELETE sales order
  router.delete('/:id', async (req, res) => {
    try {
      const deleted = await SalesOrder.destroy({ where: { id: req.params.id } });
      if (deleted) {
        res.json({ message: 'Sales order deleted' });
      } else {
        res.status(404).json({ message: 'Sales order not found' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  return router;
};