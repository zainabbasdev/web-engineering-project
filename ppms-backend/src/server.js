import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/database.js';
import errorHandler from './middlewares/errorHandler.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import salesRoutes from './routes/salesRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import ledgerRoutes from './routes/ledgerRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import fuelRateRoutes from './routes/fuelRateRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
await connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/stock-snapshot', stockRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/ledger', ledgerRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/fuel-rates', fuelRateRoutes);
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'PPMS Backend is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✓ PPMS Backend running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
