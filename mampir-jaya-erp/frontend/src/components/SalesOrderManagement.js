import React, { useEffect, useState } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import axios from 'axios';

const SalesOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({ customer: '', items: [{ product: '', quantity: 1, price: 0 }] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, customersRes, productsRes] = await Promise.all([
        axios.get('http://localhost:5001/api/sales-orders'),
        axios.get('http://localhost:5001/api/customers'),
        axios.get('http://localhost:5001/api/products')
      ]);
      setOrders(ordersRes.data);
      setCustomers(customersRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      await axios.post('http://localhost:5001/api/sales-orders', currentOrder);
      fetchData();
      setOpen(false);
      setCurrentOrder({ customer: '', items: [{ product: '', quantity: 1, price: 0 }] });
    } catch (err) {
      console.error(err);
    }
  };

  const addItem = () => {
    setCurrentOrder({ ...currentOrder, items: [...currentOrder.items, { product: '', quantity: 1, price: 0 }] });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>Sales Order Management</Typography>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>Create Sales Order</Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Number</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>{order.Customer?.name || 'N/A'}</TableCell>
                <TableCell>Rp {order.total.toLocaleString()}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Sales Order</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Customer</InputLabel>
            <Select value={currentOrder.customer} onChange={(e) => setCurrentOrder({ ...currentOrder, customer: e.target.value })}>
              {customers.map((customer) => (
                <MenuItem key={customer._id} value={customer._id}>{customer.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {currentOrder.items.map((item, index) => (
            <div key={index}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Product</InputLabel>
                <Select value={item.product} onChange={(e) => {
                  const newItems = [...currentOrder.items];
                  newItems[index].product = e.target.value;
                  const prod = products.find(p => p._id === e.target.value);
                  if (prod) newItems[index].price = prod.price;
                  setCurrentOrder({ ...currentOrder, items: newItems });
                }}>
                  {products.map((product) => (
                    <MenuItem key={product._id} value={product._id}>{product.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField label="Quantity" type="number" value={item.quantity} onChange={(e) => {
                const newItems = [...currentOrder.items];
                newItems[index].quantity = parseInt(e.target.value) || 1;
                setCurrentOrder({ ...currentOrder, items: newItems });
              }} margin="normal" fullWidth />
              <TextField label="Price" type="number" value={item.price} onChange={(e) => {
                const newItems = [...currentOrder.items];
                newItems[index].price = parseFloat(e.target.value) || 0;
                setCurrentOrder({ ...currentOrder, items: newItems });
              }} margin="normal" fullWidth />
            </div>
          ))}
          <Button onClick={addItem}>Add Item</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SalesOrderManagement;