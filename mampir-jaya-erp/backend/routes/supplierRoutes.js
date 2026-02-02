const express = require('express');
const router = express.Router();

module.exports = (sequelize) => {
  const Supplier = require('../models/Supplier')(sequelize);

  // GET all suppliers
  router.get('/', async (req, res) => {
    try {
      const suppliers = await Supplier.findAll();
      res.json(suppliers);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // POST new supplier
  router.post('/', async (req, res) => {
    try {
      const supplier = await Supplier.create(req.body);
      res.status(201).json(supplier);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // PUT update supplier
  router.put('/:id', async (req, res) => {
    try {
      const [updated] = await Supplier.update(req.body, { where: { id: req.params.id } });
      if (updated) {
        const updatedSupplier = await Supplier.findByPk(req.params.id);
        res.json(updatedSupplier);
      } else {
        res.status(404).json({ message: 'Supplier not found' });
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // DELETE supplier
  router.delete('/:id', async (req, res) => {
    try {
      const deleted = await Supplier.destroy({ where: { id: req.params.id } });
      if (deleted) {
        res.json({ message: 'Supplier deleted' });
      } else {
        res.status(404).json({ message: 'Supplier not found' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  return router;
};