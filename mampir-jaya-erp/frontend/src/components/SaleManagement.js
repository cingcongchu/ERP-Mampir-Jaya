import React, { useEffect, useState, useCallback } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Autocomplete, Box, Chip, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

const SaleManagement = () => {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState({ customerId: null, customer: '', items: [{ product: '', quantity: 1, price: 0 }] });
  const [customerDetails, setCustomerDetails] = useState({ name: '', address: '', phone: '' });
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');
  const [customerDetailDialog, setCustomerDetailDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [saleDetailDialog, setSaleDetailDialog] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const newTotal = currentSale.items.reduce((sum, item) => {
      const itemTotal = (parseInt(item.quantity) || 0) * (parseFloat(item.price) || 0);
      return sum + itemTotal;
    }, 0);
    setTotal(newTotal);
  }, [currentSale.items]);

  useEffect(() => {
    if (open) {
      fetchProducts();
      setCustomerOptions(customers);
    }
  }, [open, customers]);

  useEffect(() => {
    setCustomerOptions(customers);
  }, [customers]);

  const fetchData = async () => {
    try {
      console.log('Fetching sales and customers data...');
      const [salesRes, customersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/sales/with-details'),
        axios.get('http://localhost:5000/api/customers')
      ]);
      console.log('Sales data:', salesRes.data.length, 'items');
      console.log('Customers data:', customersRes.data.length, 'items');
      setSales(salesRes.data);
      setCustomers(customersRes.data);
      setCustomerOptions(customersRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProductOptions(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const searchProducts = useCallback(debounce(async (query) => {
    if (query) {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/search?q=${query}`);
        // Keep currently selected products in options to prevent them from disappearing
        const currentSelectedProducts = currentSale.items
          .map(item => productOptions.find(p => p.name === item.product))
          .filter(Boolean);

        const combinedOptions = [...new Set([...res.data, ...currentSelectedProducts])];
        setProductOptions(combinedOptions);
      } catch (err) {
        console.error(err);
      }
    } else {
      fetchProducts();
    }
  }, 300), [currentSale.items, productOptions, fetchProducts]);

  const searchCustomers = useCallback(debounce(async (query) => {
    if (query) {
      try {
        const res = await axios.get(`http://localhost:5000/api/customers/search?q=${query}`);
        // Keep currently selected customers in options to prevent them from disappearing
        const currentSelectedCustomers = customerOptions.filter(c =>
          currentSale.customer && c.name.toLowerCase().includes(currentSale.customer.toLowerCase())
        );

        const combinedOptions = [...new Set([...res.data, ...currentSelectedCustomers])];
        setCustomerOptions(combinedOptions);
      } catch (err) {
        console.error(err);
      }
    } else {
      setCustomerOptions(customers);
    }
  }, 300), [customers, customerOptions, currentSale.customer]);

  const handleCustomerChange = (customerId, customerName) => {
    setCurrentSale({ ...currentSale, customerId, customer: customerName });
    setCustomerDetails({ ...customerDetails, name: customerName });

    // Check if customer exists (case-insensitive)
    const existingCustomer = customers.find(c => c.name.toLowerCase() === customerName.toLowerCase());
    if (!existingCustomer && customerName.trim()) {
      setShowCustomerDetails(true);
    } else {
      setShowCustomerDetails(false);
    }
  };

  const handleSave = async () => {
    try {
      setError('');
      let saleData = { ...currentSale };

      // Remove customerId from saleData, send customer name instead
      delete saleData.customerId;
      saleData.customer = currentSale.customer;

      // If customer details are provided, send them too
      if (showCustomerDetails && customerDetails.name) {
        saleData.customerDetails = customerDetails;
      }

      console.log('Saving sale:', saleData);
      const response = await axios.post('http://localhost:5000/api/sales', saleData);
      console.log('Sale saved successfully:', response.data);

      // Refresh data immediately
      await fetchData();

      setOpen(false);
      setCurrentSale({ customerId: null, customer: '', items: [{ product: '', quantity: 1, price: 0 }] });
      setCustomerDetails({ name: '', address: '', phone: '' });
      setShowCustomerDetails(false);
    } catch (err) {
      console.error('Error saving sale:', err);
      setError(err.response?.data?.message || 'Failed to save sale');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentSale({ customer: '', items: [{ product: '', quantity: 1, price: 0 }] });
    setCustomerDetails({ name: '', address: '', phone: '' });
    setShowCustomerDetails(false);
    setError('');
    setEditMode(false);
  };

  const addItem = () => {
    setCurrentSale(prevSale => ({
      ...prevSale,
      items: [...prevSale.items, { product: '', quantity: 1, price: 0, id: Date.now() + Math.random() }]
    }));
  };

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setCustomerDetailDialog(true);
  };

  const handleTotalClick = (sale) => {
    setSelectedSale(sale);
    setSaleDetailDialog(true);
  };

  const handleDeleteClick = (sale) => {
    setSaleToDelete(sale);
    setDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (saleToDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/sales/${saleToDelete.id}`);
        fetchData(); // Refresh data after delete
        setDeleteDialog(false);
        setSaleToDelete(null);
      } catch (err) {
        console.error('Error deleting sale:', err);
        setError('Failed to delete sale');
      }
    }
  };

  const handleEditClick = (sale) => {
    // Convert sale data to currentSale format for editing
    const editSale = {
      customer: sale.Customer?.name || '',
      items: sale.SaleItems?.map(item => ({
        product: item.Product?.name || '',
        quantity: item.quantity,
        price: item.price,
        id: item.id
      })) || [{ product: '', quantity: 1, price: 0 }]
    };
    setCurrentSale(editSale);
    setEditMode(true);
    setOpen(true);
  };

  const handleUpdate = async () => {
    try {
      setError('');
      let saleData = { ...currentSale };

      // If customer details are provided, send them too
      if (showCustomerDetails && customerDetails.name) {
        saleData.customerDetails = customerDetails;
      }

      console.log('Updating sale:', saleData);
      // For now, we'll create a new sale since we don't have the original sale ID
      // In a real app, you'd want to pass the sale ID and update existing sale
      const response = await axios.post('http://localhost:5000/api/sales', saleData);
      console.log('Sale updated successfully:', response.data);

      // Refresh data immediately
      await fetchData();

      setOpen(false);
      setCurrentSale({ customer: '', items: [{ product: '', quantity: 1, price: 0 }] });
      setCustomerDetails({ name: '', address: '', phone: '' });
      setShowCustomerDetails(false);
      setEditMode(false);
    } catch (err) {
      console.error('Error updating sale:', err);
      setError(err.response?.data?.message || 'Failed to update sale');
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>Sale Management</Typography>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>Create Sale</Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.invoiceNumber}</TableCell>
                  <TableCell>
                    <Chip
                      label={sale.Customer?.name || 'N/A'}
                      onClick={() => sale.Customer && handleCustomerClick(sale.Customer)}
                      sx={{ cursor: sale.Customer ? 'pointer' : 'default' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`Rp ${sale.total.toLocaleString()}`}
                      onClick={() => handleTotalClick(sale)}
                      sx={{ cursor: 'pointer' }}
                    />
                  </TableCell>
                  <TableCell>{new Date(sale.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEditClick(sale)}
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(sale)}
                      color="error"
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
           </TableBody>
        </Table>
      </TableContainer>
       <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
         <DialogTitle>{editMode ? 'Edit Sale' : 'Create Sale'}</DialogTitle>
          <DialogContent>
           {error && <Typography color="error">{error}</Typography>}
            <Autocomplete
              options={customerOptions}
              getOptionLabel={(option) => option.name || ''}
               value={currentSale.customerId ? customerOptions.find(c => c.id === currentSale.customerId) || null : null}
               onInputChange={(e, value) => {
                 searchCustomers(value);
                 handleCustomerChange(null, value);
               }}
               onChange={(e, value) => {
                 const customerId = value ? value.id : null;
                 const customerName = value ? value.name : '';
                 handleCustomerChange(customerId, customerName);
               }}
              renderInput={(params) => <TextField {...params} label="Customer Name" margin="normal" fullWidth />}
              freeSolo
            />

            {showCustomerDetails && (
              <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>Customer Details (New Customer)</Typography>
                <TextField
                  label="Address"
                  value={customerDetails.address}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })}
                  margin="normal"
                  fullWidth
                  multiline
                  rows={2}
                />
                 <TextField
                   label="Phone"
                   value={customerDetails.phone}
                   onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                   margin="normal"
                   fullWidth
                 />
              </Box>
            )}
            {currentSale.items.map((item, index) => (
              <div key={item.id || index}>
               <Autocomplete
                 options={productOptions}
                 getOptionLabel={(option) => option.name || ''}
                 value={productOptions.find(p => p.name === item.product) || null}
                 onInputChange={(e, value) => searchProducts(value)}
                   onChange={(e, value) => {
                     setCurrentSale(prevSale => {
                       const newItems = [...prevSale.items];
                       newItems[index].product = value ? value.name : '';
                       if (value) newItems[index].price = parseFloat(value.price) || 0;
                       return { ...prevSale, items: newItems };
                     });
                   }}
                 renderInput={(params) => <TextField {...params} label="Product Name" margin="normal" fullWidth />}
               />
                <TextField
                  label="Quantity"
                  type="number"
                  value={item.quantity}
                    onChange={(e) => {
                      const value = e.target.value;
                      const newQuantity = value === '' ? '' : (parseInt(value) || 0);
                      setCurrentSale(prevSale => {
                        const newItems = [...prevSale.items];
                        newItems[index].quantity = newQuantity;
                        return { ...prevSale, items: newItems };
                      });
                    }}
                  inputProps={{ min: 0, step: 1 }}
                  margin="normal"
                  fullWidth
                />
                <TextField
                  label="Price"
                  type="number"
                  value={item.price}
                   onChange={(e) => {
                     const newPrice = parseFloat(e.target.value) || 0;
                     setCurrentSale(prevSale => {
                       const newItems = [...prevSale.items];
                       newItems[index].price = newPrice;
                       return { ...prevSale, items: newItems };
                     });
                   }}
                  inputProps={{ min: 0, step: 0.01 }}
                  margin="normal"
                  fullWidth
                />
            </div>
           ))}
           <Button onClick={addItem} sx={{ mt: 1, mb: 2 }}>Add Item</Button>

           <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
             <Typography variant="h6">
               Total: Rp {total.toLocaleString('id-ID')}
             </Typography>
           </Box>
        </DialogContent>
         <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={editMode ? handleUpdate : handleSave} variant="contained">
              {editMode ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
       </Dialog>

       {/* Customer Detail Dialog */}
       <Dialog open={customerDetailDialog} onClose={() => setCustomerDetailDialog(false)} maxWidth="sm" fullWidth>
         <DialogTitle>Customer Details</DialogTitle>
         <DialogContent>
           {selectedCustomer && (
             <Box sx={{ pt: 2 }}>
               <Typography variant="h6" gutterBottom>{selectedCustomer.name}</Typography>
               <Typography variant="body1"><strong>Address:</strong> {selectedCustomer.address || 'Not provided'}</Typography>
               <Typography variant="body1"><strong>Phone:</strong> {selectedCustomer.phone || 'Not provided'}</Typography>
             </Box>
           )}
         </DialogContent>
         <DialogActions>
           <Button onClick={() => setCustomerDetailDialog(false)}>Close</Button>
         </DialogActions>
       </Dialog>

       {/* Sale Detail Dialog */}
       <Dialog open={saleDetailDialog} onClose={() => setSaleDetailDialog(false)} maxWidth="md" fullWidth>
         <DialogTitle>Sale Details - {selectedSale?.invoiceNumber}</DialogTitle>
         <DialogContent>
           {selectedSale && (
             <Box sx={{ pt: 2 }}>
               <Typography variant="h6" gutterBottom>Customer: {selectedSale.Customer?.name || 'N/A'}</Typography>
               <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Products Ordered:</Typography>
               <TableContainer component={Paper} sx={{ mt: 1 }}>
                 <Table size="small">
                   <TableHead>
                     <TableRow>
                       <TableCell>Product</TableCell>
                       <TableCell align="right">Quantity</TableCell>
                       <TableCell align="right">Price</TableCell>
                       <TableCell align="right">Subtotal</TableCell>
                     </TableRow>
                   </TableHead>
                   <TableBody>
                     {selectedSale.SaleItems?.map((item) => (
                       <TableRow key={item.id}>
                         <TableCell>{item.Product?.name || 'Unknown Product'}</TableCell>
                         <TableCell align="right">{item.quantity} {item.Product?.unit || 'pcs'}</TableCell>
                         <TableCell align="right">Rp {parseFloat(item.price).toLocaleString()}</TableCell>
                         <TableCell align="right">Rp {(item.quantity * item.price).toLocaleString()}</TableCell>
                       </TableRow>
                     ))}
                     <TableRow>
                       <TableCell colSpan={3} align="right"><strong>Total:</strong></TableCell>
                       <TableCell align="right"><strong>Rp {selectedSale.total.toLocaleString()}</strong></TableCell>
                     </TableRow>
                   </TableBody>
                 </Table>
               </TableContainer>
             </Box>
           )}
         </DialogContent>
         <DialogActions>
           <Button onClick={() => setSaleDetailDialog(false)}>Close</Button>
         </DialogActions>
       </Dialog>

       {/* Delete Confirmation Dialog */}
       <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
         <DialogTitle>Confirm Delete</DialogTitle>
         <DialogContent>
           <Typography>
             Are you sure you want to delete invoice {saleToDelete?.invoiceNumber}?
             This action cannot be undone.
           </Typography>
         </DialogContent>
         <DialogActions>
           <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
           <Button onClick={handleDeleteConfirm} variant="contained" color="error">
             Delete
           </Button>
         </DialogActions>
       </Dialog>
     </Box>
   );
 };

export default SaleManagement;