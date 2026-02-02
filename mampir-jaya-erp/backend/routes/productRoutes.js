const express = require('express');
const router = express.Router();

const { Op } = require('sequelize');

module.exports = (sequelize) => {
  const Product = require('../models/Product')(sequelize);

  // GET all products
  router.get('/', async (req, res) => {
    try {
      const products = await Product.findAll();
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // GET products by search
  router.get('/search', async (req, res) => {
    try {
      const { q } = req.query;
      const products = await Product.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${q}%` } },
            { name: { [Op.like]: `%${q.toLowerCase()}%` } },
            { name: { [Op.like]: `%${q.toUpperCase()}%` } }
          ]
        }
      });
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // POST new product
  router.post('/', async (req, res) => {
    try {
      const product = await Product.create(req.body);
      res.status(201).json(product);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // PUT update product
  router.put('/:id', async (req, res) => {
    try {
      const [updated] = await Product.update(req.body, { where: { id: req.params.id } });
      if (updated) {
        const updatedProduct = await Product.findByPk(req.params.id);
        res.json(updatedProduct);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // DELETE product
  router.delete('/:id', async (req, res) => {
    try {
      const deleted = await Product.destroy({ where: { id: req.params.id } });
      if (deleted) {
        res.json({ message: 'Product deleted' });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  return router;
};