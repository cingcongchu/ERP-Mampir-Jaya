// Update stock for a product
const updateStock = async (Product, productId, quantityChange) => {
  try {
    const product = await Product.findByPk(productId);
    if (!product) throw new Error('Product not found');
    product.stock += quantityChange;
    if (product.stock < 0) throw new Error('Insufficient stock');
    await product.save();
    return product;
  } catch (err) {
    throw err;
  }
};

module.exports = { updateStock };