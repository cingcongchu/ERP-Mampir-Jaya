const express = require('express');
const router = express.Router();

const { Op } = require('sequelize');

module.exports = (sequelize) => {
  const Customer = require('../models/Customer')(sequelize);

  // GET all customers
  router.get('/', async (req, res) => {
    try {
      const customers = await Customer.findAll();
      res.json(customers);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // GET customers by search
  router.get('/search', async (req, res) => {
    try {
      const { q } = req.query;
      const customers = await Customer.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${q}%` } },
            { name: { [Op.like]: `%${q.toLowerCase()}%` } },
            { name: { [Op.like]: `%${q.toUpperCase()}%` } }
          ]
        }
      });
      res.json(customers);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // POST new customer
  router.post('/', async (req, res) => {
    try {
      const customer = await Customer.create(req.body);
      res.status(201).json(customer);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // PUT update customer
  router.put('/:id', async (req, res) => {
    try {
      const [updated] = await Customer.update(req.body, { where: { id: req.params.id } });
      if (updated) {
        const updatedCustomer = await Customer.findByPk(req.params.id);
        res.json(updatedCustomer);
      } else {
        res.status(404).json({ message: 'Customer not found' });
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // DELETE customer
  router.delete('/:id', async (req, res) => {
    try {
      const deleted = await Customer.destroy({ where: { id: req.params.id } });
      if (deleted) {
        res.json({ message: 'Customer deleted' });
      } else {
        res.status(404).json({ message: 'Customer not found' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  return router;
};