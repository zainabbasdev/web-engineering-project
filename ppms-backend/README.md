# PPMS Backend - Petrol Pump Management System

A production-grade Node.js + Express backend for the Petrol Pump Management System.

## 📦 Features

- ✅ JWT-based Authentication with Role-Based Access Control
- ✅ Mongoose ODM with comprehensive data validation
- ✅ RESTful API design following best practices
- ✅ Fuel Inventory & Sales Management
- ✅ Real-time Stock Snapshot calculation
- ✅ Employee & Expense tracking
- ✅ Customer Ledger with transaction history
- ✅ Profit & Loss reporting with aggregation pipeline
- ✅ External API proxy (Fuel Prices)
- ✅ Global error handling
- ✅ Request logging with Morgan
- ✅ CORS enabled

## 🚀 Quick Start

### Prerequisites

- Node.js >= 14
- MongoDB >= 4.0 (local instance running on `127.0.0.1:27017`)
- npm or yarn

### Installation

1. Clone the repository and navigate to backend folder:
```bash
cd ppms-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
MONGO_URI=mongodb://127.0.0.1:27017/ppms
JWT_SECRET=your_super_secret_key
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

5. Start the server:
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will start on `http://localhost:5000`

## 📁 Project Structure

```
src/
├── config/           # Database & environment configuration
├── models/          # Mongoose schemas
├── controllers/     # Business logic
├── routes/          # API routes
├── middlewares/     # Auth, role, error handling
├── services/        # Reusable business logic
├── utils/           # Helpers & validators
├── constants/       # Enums & constants
└── server.js        # Main entry point
```

## 🔐 Authentication

All endpoints except `/api/auth/login` and `/api/auth/register` require JWT token in header:

```
Authorization: Bearer <token>
```

### User Roles

- **Admin**: Full access to all modules
- **Manager**: Operations (cannot delete records)
- **Accountant**: Finance modules only

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - Register new admin
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Inventory
- `GET /api/inventory` - List fuel topups
- `POST /api/inventory` - Add topup
- `PUT /api/inventory/:id` - Update topup
- `DELETE /api/inventory/:id` - Delete topup (Admin)

### Sales
- `GET /api/sales` - List sales
- `POST /api/sales` - Record sale
- `PUT /api/sales/:id` - Update sale
- `DELETE /api/sales/:id` - Delete sale (Admin)

### Stock
- `GET /api/stock-snapshot` - Get stock levels

### Employees
- `GET /api/employees` - List employees
- `POST /api/employees` - Add employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee (Admin)

### Expenses
- `GET /api/expenses` - List expenses
- `POST /api/expenses` - Add expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense (Admin)

### Customer Ledger
- `GET /api/ledger` - List customers
- `POST /api/ledger` - Create customer
- `GET /api/ledger/:id` - Get customer with transactions
- `POST /api/ledger/:id/transaction` - Add transaction
- `DELETE /api/ledger/:id/transaction/:txId` - Delete transaction
- `DELETE /api/ledger/:id` - Delete customer (Admin)

### Reports
- `GET /api/reports/profit-loss` - P&L report
- `GET /api/reports/revenue-by-fuel` - Revenue breakdown
- `GET /api/reports/daily-summary` - Daily sales summary
- `GET /api/reports/fuel-prices` - International fuel prices

## 🛠️ Key Technologies

- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM with validation
- **JWT** - Token-based auth
- **bcryptjs** - Password hashing
- **Morgan** - HTTP request logging
- **CORS** - Cross-origin resource sharing
- **Axios** - HTTP client for external APIs

## 🔄 Data Flow

### Stock Management
```
Fuel Topup / Sale Created/Updated/Deleted
    ↓
StockService.updateStockSnapshot()
    ↓
StockSnapshot document updated (totalAdded - totalSold)
    ↓
Dashboard reads from StockSnapshot (fast query)
```

### Customer Ledger
```
Add Transaction
    ↓
LedgerService.addTransaction()
    ↓
Calculate new balance based on transaction type
    ↓
Update CustomerLedger document
    ↓
Frontend displays running balance
```

### Profit & Loss
```
Report Request
    ↓
ReportService.getProfitLossReport()
    ↓
Aggregate Sales (revenue & cost)
    ↓
Aggregate Expenses (by category)
    ↓
Calculate: NetProfit = TotalRevenue - TotalExpenses
```

## 🧪 Testing with Postman

1. **Register Admin**:
```
POST /api/auth/register
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123",
  "pumpName": "My Petrol Pump",
  "role": "admin"
}
```

2. **Login**:
```
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "password123"
}
```

3. **Add Fuel Topup** (with Authorization header):
```
POST /api/inventory
{
  "fuelType": "Petrol",
  "litersAdded": 1000,
  "pricePerLiter": 280,
  "supplier": "PSO",
  "date": "2024-01-10"
}
```

## ⚠️ Error Handling

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

### HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🔒 Security Features

- ✅ JWT token expiry (7 days)
- ✅ bcryptjs password hashing (12 salt rounds)
- ✅ Role-based access control
- ✅ CORS protection
- ✅ Password field never returned in API responses
- ✅ API key protection (fuel prices proxy)

## 📊 Database Collections

- **Users** - Authentication & roles
- **FuelTopup** - Inventory records
- **Sales** - Transaction records
- **StockSnapshot** - Real-time stock cache
- **Employees** - HR records
- **Expenses** - Operational costs
- **CustomerLedger** - Credit accounts with embedded transactions

## 🚨 Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check MONGO_URI in .env

### JWT Token Expired
- Frontend should re-login to get new token
- Token has 7-day expiry by default

### CORS Error
- Add frontend URL to CLIENT_URL in .env
- Check CORS middleware configuration

## 📝 Development Tips

- Use `npm run dev` for development with auto-reload
- Check `/health` endpoint to verify server is running
- All endpoints log requests via Morgan
- Use Postman or Thunder Client for API testing

## 🎯 Next Steps

- Add request validation with Zod/Joi
- Implement rate limiting
- Add API documentation with Swagger
- Setup automated testing with Jest
- Add database seeding script

## 📄 License

MIT
