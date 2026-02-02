import React, { useEffect, useState, useCallback } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, IconButton, Box, InputAdornment, Chip, FormControl, InputLabel, Select, MenuItem, CircularProgress, Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import { Edit, Delete, Search, Add, FilterList } from '@mui/icons-material';
import axios from 'axios';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ name: '', description: '', category: '', price: '', stock: '', unit: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter]);

  const filterProducts = useCallback(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter]);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to load products', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (currentProduct.id) {
        await axios.put(`http://localhost:5000/api/products/${currentProduct.id}`, currentProduct);
        setSnackbar({ open: true, message: 'Product updated successfully', severity: 'success' });
      } else {
        await axios.post('http://localhost:5000/api/products', currentProduct);
        setSnackbar({ open: true, message: 'Product added successfully', severity: 'success' });
      }
      fetchProducts();
      setOpen(false);
      setCurrentProduct({ name: '', description: '', category: '', price: '', stock: '', unit: '' });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to save product', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const categories = [...new Set(products.map(product => product.category))].filter(Boolean);

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        setSnackbar({ open: true, message: 'Product deleted successfully', severity: 'success' });
        fetchProducts();
      } catch (err) {
        console.error(err);
        setSnackbar({ open: true, message: 'Failed to delete product', severity: 'error' });
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>Product Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
          sx={{ borderRadius: 2 }}
        >
          Add Product
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Category</InputLabel>
          <Select
            value={categoryFilter}
            label="Filter by Category"
            onChange={(e) => setCategoryFilter(e.target.value)}
            startAdornment={<FilterList sx={{ mr: 1, color: 'action.active' }} />}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {(searchTerm || categoryFilter) && (
          <Chip
            label={`${filteredProducts.length} products found`}
            color="primary"
            variant="outlined"
          />
        )}
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Stock</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <CircularProgress />
                  <Typography sx={{ mt: 2, color: 'text.secondary' }}>Loading products...</Typography>
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  {products.length === 0 ? 'No products found. Add your first product!' : 'No products match your search criteria.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {product.name}
                      </Typography>
                      {product.description && (
                        <Typography variant="body2" color="text.secondary">
                          {product.description.length > 50 ? `${product.description.substring(0, 50)}...` : product.description}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    Rp {parseFloat(product.price).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        {product.stock}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product.unit}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEdit(product)}
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(product.id)}
                      color="error"
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          {currentProduct.id ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Product Name"
              fullWidth
              value={currentProduct.name}
              onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
              required
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={2}
              value={currentProduct.description}
              onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
            />
            <TextField
              label="Category"
              fullWidth
              value={currentProduct.category}
              onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
              placeholder="e.g., Cement, Bricks, Tools"
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Price (Rp)"
                type="number"
                fullWidth
                value={currentProduct.price}
                onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>Rp</Box>,
                }}
              />
              <TextField
                label="Stock Quantity"
                type="number"
                fullWidth
                value={currentProduct.stock}
                onChange={(e) => setCurrentProduct({ ...currentProduct, stock: e.target.value })}
              />
            </Box>
            <TextField
              label="Unit"
              fullWidth
              value={currentProduct.unit}
              onChange={(e) => setCurrentProduct({ ...currentProduct, unit: e.target.value })}
              placeholder="e.g., kg, pieces, bags"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ borderRadius: 2 }}
            disabled={!currentProduct.name || !currentProduct.price || saving}
            startIcon={saving ? <CircularProgress size={20} /> : null}
          >
            {saving ? 'Saving...' : (currentProduct._id ? 'Update Product' : 'Add Product')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductManagement;