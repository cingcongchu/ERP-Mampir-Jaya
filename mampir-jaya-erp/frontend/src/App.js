import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ProductManagement from './components/ProductManagement';
import SaleManagement from './components/SaleManagement';
import SalesOrderManagement from './components/SalesOrderManagement';
import Reports from './components/Reports';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/sales" element={<SaleManagement />} />
        <Route path="/sales-orders" element={<SalesOrderManagement />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
