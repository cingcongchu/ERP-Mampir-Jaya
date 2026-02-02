import React, { useEffect, useState } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, CircularProgress, Alert, Tabs, Tab } from '@mui/material';
import axios from 'axios';

const Reports = () => {
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const [salesRes, purchasesRes, productsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/sales/with-details'),
        axios.get('http://localhost:5000/api/purchases'),
        axios.get('http://localhost:5000/api/products')
      ]);

      setSales(salesRes.data);
      setPurchases(purchasesRes.data);
      setInventory(productsRes.data);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports data');
    } finally {
      setLoading(false);
    }
  };

  const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.total || 0), 0);
  const totalPurchases = purchases.reduce((sum, purchase) => sum + parseFloat(purchase.total || 0), 0);
  const totalInventoryValue = inventory.reduce((sum, product) => sum + (parseFloat(product.price || 0) * parseInt(product.stock || 0)), 0);

  // Additional metrics
  const totalProducts = inventory.length;
  const lowStockProducts = inventory.filter(product => product.stock < 10).length;
  const totalSalesCount = sales.length;
  const averageSaleValue = totalSalesCount > 0 ? totalSales / totalSalesCount : 0;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading reports...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>Business Reports</Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Financial Summary" />
          <Tab label="Sales Report" />
          <Tab label="Purchases Report" />
          <Tab label="Inventory Report" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>Financial Summary</Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Metric</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Total Sales Revenue</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>Rp {totalSales.toLocaleString('id-ID')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Purchase Cost</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>Rp {totalPurchases.toLocaleString('id-ID')}</TableCell>
                </TableRow>
                <TableRow sx={{ backgroundColor: 'success.light', '& td': { color: 'white', fontWeight: 'bold' } }}>
                  <TableCell>Gross Profit</TableCell>
                  <TableCell>Rp {(totalSales - totalPurchases).toLocaleString('id-ID')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Inventory Value</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>Rp {totalInventoryValue.toLocaleString('id-ID')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Products</TableCell>
                  <TableCell>{totalProducts}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Low Stock Products (&lt; 10)</TableCell>
                  <TableCell sx={{ color: lowStockProducts > 0 ? 'error.main' : 'success.main', fontWeight: 500 }}>
                    {lowStockProducts}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Sales Transactions</TableCell>
                  <TableCell>{totalSalesCount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Average Sale Value</TableCell>
                  <TableCell>Rp {averageSaleValue.toLocaleString('id-ID')}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>Sales Report</Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Invoice</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Items</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{sale.invoiceNumber}</TableCell>
                    <TableCell>{sale.Customer?.name || 'N/A'}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>Rp {parseFloat(sale.total).toLocaleString('id-ID')}</TableCell>
                    <TableCell>{new Date(sale.createdAt).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell>{sale.SaleItems?.length || 0} items</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {tabValue === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>Purchases Report</Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600 }}>PO Number</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Supplier</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchases.map((purchase) => (
                  <TableRow key={purchase.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{purchase.purchaseOrder}</TableCell>
                    <TableCell>{purchase.Supplier?.name || 'N/A'}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>Rp {parseFloat(purchase.total).toLocaleString('id-ID')}</TableCell>
                    <TableCell>{new Date(purchase.createdAt).toLocaleDateString('id-ID')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {tabValue === 3 && (
        <Box>
          <Typography variant="h6" gutterBottom>Inventory Report</Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Product Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Stock</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Unit Price</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Total Value</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventory.map((product) => {
                  const totalValue = parseFloat(product.price) * parseInt(product.stock);
                  const isLowStock = product.stock < 10;
                  return (
                    <TableRow key={product.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {product.name}
                        {product.description && (
                          <Typography variant="body2" color="text.secondary">
                            {product.description.length > 30 ? `${product.description.substring(0, 30)}...` : product.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{product.stock} {product.unit}</TableCell>
                      <TableCell>Rp {parseFloat(product.price).toLocaleString('id-ID')}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>Rp {totalValue.toLocaleString('id-ID')}</TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            color: isLowStock ? 'error.main' : product.stock < 50 ? 'warning.main' : 'success.main',
                            fontWeight: 500
                          }}
                        >
                          {isLowStock ? 'Low Stock' : product.stock < 50 ? 'Medium' : 'Good'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default Reports;