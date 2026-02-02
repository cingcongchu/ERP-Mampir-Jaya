# MAMPIR JAYA ERP

A comprehensive ERP system for MAMPIR JAYA building materials store, built with React frontend and Node.js/Express backend with MySQL.

## Features

- **Dashboard**: Overview of sales, purchases, and inventory metrics with charts.
- **Product Management**: Add, edit, delete products with stock tracking.
- **Sales Management**: Create sales invoices, manage customers, track sales.
- **Purchase Management**: Handle purchase orders and suppliers.
- **Reports**: Financial summaries and detailed reports.

## Tech Stack

- **Frontend**: React, Material-UI, Axios, Recharts
- **Backend**: Node.js, Express, MySQL, Sequelize
- **Database**: MySQL

## Setup

1. **Install MySQL**: Ensure MySQL is installed and running on your system (default user: root, password: empty).

2. **Create Database**:
   - Run the SQL script in `create_db.sql` to create the database.

3. **Backend Setup**:
   - Navigate to `backend` directory: `cd backend`
   - Install dependencies: `npm install`
   - Update `.env` with your MySQL credentials if needed.
   - Start server: `npm start` (runs on port 5000)

4. **Frontend Setup**:
   - Navigate to `frontend` directory: `cd frontend`
   - Install dependencies: `npm install`
   - Start app: `npm start` (runs on port 3000)

5. Open browser to `http://localhost:3000`

## API Endpoints

- `/api/products`: CRUD for products
- `/api/customers`: CRUD for customers
- `/api/suppliers`: CRUD for suppliers
- `/api/sales`: CRUD for sales
- `/api/purchases`: CRUD for purchases

## Notes

- Ensure MySQL is running before starting the backend.
- The system automatically updates inventory stock on sales and purchases.
- Tables are created automatically by Sequelize on first run.