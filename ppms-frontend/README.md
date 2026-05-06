# PPMS Frontend - Petrol Pump Management System

A modern, production-ready React frontend for the Petrol Pump Management System. Built with Tailwind CSS, Redux Toolkit, and RTK Query.

## ✨ Features

- ✅ Modern SaaS-level UI with Tailwind CSS
- ✅ Role-based dashboard (Admin, Manager, Accountant)
- ✅ JWT authentication with token persistence
- ✅ Responsive sidebar + topbar layout
- ✅ Reusable component system
- ✅ Data tables with pagination & sorting
- ✅ Form modals with validation
- ✅ Real-time charts (Recharts)
- ✅ External API widgets (Weather + Fuel Prices)
- ✅ Loading states with skeleton loaders
- ✅ Toast notifications
- ✅ Dark mode ready (optional)

## 🚀 Quick Start

### Prerequisites

- Node.js >= 16
- npm or yarn
- Backend API running on `http://localhost:5000`

### Installation

1. Navigate to frontend folder:
```bash
cd ppms-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Server will start on `http://localhost:5173`

## 📁 Project Structure

```
src/
├── app/
│   ├── slices/           # Redux slices (auth, inventory, etc.)
│   └── store.js          # Redux store configuration
├── components/
│   ├── ui/               # Base components (Button, Input, Card, etc.)
│   └── shared/           # Feature components (Filters, Widgets, etc.)
├── layouts/
│   └── AdminLayout.jsx   # Main layout with Sidebar + Topbar
├── pages/                # Page components (Dashboard, Inventory, etc.)
├── services/
│   └── apiClient.js      # Axios configuration with interceptors
├── constants/
│   └── index.js          # App constants (roles, fuel types, etc.)
├── styles/
│   └── globals.css       # Tailwind CSS setup
├── App.jsx               # Root component with routing
├── main.jsx              # Entry point with Redux provider
└── vite.config.js        # Vite configuration
```

## 🎨 Design System

### Colors

- **Primary**: Sky blue (#0284c7) - Main actions & links
- **Success**: Green (#16a34a) - Positive states
- **Warning**: Amber (#eab308) - Caution states
- **Danger**: Red (#dc2626) - Destructive actions
- **Neutral**: Gray scale for text & backgrounds

### Typography

- **H1**: 30px, bold (page titles)
- **H2**: 24px, bold (section titles)
- **H3**: 20px, bold (subsections)
- **Body**: 16px, regular (default text)
- **Small**: 14px, regular (secondary text)
- **Tiny**: 12px, regular (labels)

### Spacing

Uses 8px grid system:
- `px-1` = 4px
- `px-2` = 8px
- `px-4` = 16px
- `px-6` = 24px
- etc.

### Components

All components support variants and sizes:

- **Button**: primary, secondary, ghost, danger, outline
- **Input**: with label, error states, icon support
- **Card**: with shadow, border, padding
- **Badge**: success, warning, danger variants
- **Table**: pagination, sorting, actions
- **Modal**: responsive, dismissible

## 🔐 Authentication

### Login Flow

1. User enters credentials on LoginPage
2. API request to `/api/auth/login`
3. Token stored in localStorage
4. User redirected to Dashboard
5. Token automatically attached to all requests via Axios interceptor

### Token Management

- Stored in localStorage under `authToken`
- Automatically added to request headers: `Authorization: Bearer <token>`
- Auto logout on 401 response
- 7-day expiry (managed by backend)

## 📊 Key Pages

### Dashboard
- Overview statistics (today's sales, liters sold, stock, entries)
- 7-day sales revenue chart
- Weather widget (real-time local conditions)
- Current stock breakdown by fuel type
- Fuel price widget (international benchmarks)

### Fuel Inventory
- Table of all fuel top-up records
- Add/Edit/Delete operations
- Filters (fuel type, date range)
- Pagination & search
- Auto-calculated total cost

### Daily Sales
- Record fuel sales per shift & nozzle
- Filters (fuel type, shift, date)
- Pagination
- Real-time stock snapshot updates

### Stock Monitoring
- Current stock levels per fuel type
- Gauge cards visualization
- Stock movement history
- Integrated weather widget

### Employees
- Employee directory with CNIC, role, salary
- Filter by role & employment status
- Soft-delete (mark as inactive)
- Add/Edit operations

### Expenses
- Track operational expenses
- Categorize by type (Electricity, Maintenance, Salary, etc.)
- Month & category filters
- Feed into P&L reports

### Customer Ledger
- Customer credit accounts (khata system)
- Transaction history per customer
- Running balance tracking
- Udhar (credit), Wapsi (payment), NIL (settlement) types

### Profit & Loss Reports
- Monthly financial overview
- Revenue vs Expenses visualization
- Breakdown by category
- Date range picker
- International fuel price reference

## 🛠️ Development

### File Structure Best Practices

- **Components** are in `components/` (reusable UI)
- **Pages** are in `pages/` (route-connected)
- **Redux slices** in `app/slices/`
- **API calls** via `services/apiClient.js`
- **Constants** in `constants/index.js`

### Adding a New Page

1. Create page component in `src/pages/NewPage.jsx`
2. Add route in `App.jsx`
3. Link from navigation if applicable
4. Use AdminLayout wrapper for consistency

### Adding a New Component

1. Create in appropriate folder (`ui/` or `shared/`)
2. Export as named export
3. Add PropTypes or JSDoc comments
4. Use Tailwind CSS for styling
5. Support variants & sizes where applicable

## 🔄 API Integration

### Making API Calls

```javascript
import apiClient from '../services/apiClient';

// GET
const response = await apiClient.get('/inventory');

// POST
await apiClient.post('/sales', { fuelType: 'Petrol', litersSold: 100 });

// PUT
await apiClient.put(`/inventory/${id}`, { ...updates });

// DELETE
await apiClient.delete(`/inventory/${id}`);
```

### Response Format

```javascript
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    // actual data
    "pagination": { "page": 1, "limit": 10, "total": 50 }
  }
}
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Login with valid credentials
- [ ] Dashboard loads stats correctly
- [ ] Can add inventory topup
- [ ] Can record a sale
- [ ] Stock snapshot updates
- [ ] Can add employee
- [ ] Can log expense
- [ ] Can add customer & transaction
- [ ] Reports generate correctly
- [ ] Weather widget displays
- [ ] Fuel price widget loads
- [ ] Sidebar navigation works
- [ ] User logout works

## 🚀 Deployment

### Build

```bash
npm run build
```

Creates optimized production build in `dist/` folder.

### Environment Variables

Create `.env` file:
```
VITE_API_URL=http://your-backend-url/api
VITE_WEATHER_KEY=your_openweathermap_key
```

### Deployment Options

- **Vercel**: Push to GitHub, auto-deploy
- **Netlify**: Connect repo, auto-build & deploy
- **Docker**: Create Dockerfile for containerization
- **Traditional**: Build & host on any static server

## 📚 Component Library

### UI Components

| Component | Props | Example |
|-----------|-------|---------|
| Button | variant, size, loading, fullWidth | `<Button variant="primary" size="md">Click</Button>` |
| Input | label, error, type, placeholder | `<Input label="Email" type="email" />` |
| Select | label, options, error | `<Select label="Role" options={roles} />` |
| Card | className | `<Card className="p-6">Content</Card>` |
| DataTable | columns, data, pagination | `<DataTable columns={cols} data={data} />` |
| Modal | isOpen, onClose, title | `<Modal isOpen={open} onClose={close}>...</Modal>` |

### Feature Components

| Component | Purpose |
|-----------|---------|
| AdminLayout | Main app layout with sidebar + topbar |
| Sidebar | Left navigation menu |
| Topbar | Top bar with user menu |
| SearchBar | Search input with debounce |
| FilterDropdown | Select filter |
| WeatherWidget | Real-time weather display |
| FuelPriceWidget | International fuel prices |
| LineChart | 7-day trend visualization |
| BarChart | Revenue vs Expenses |
| GaugeCard | Stock level indicator |

## 🎯 Performance

- Lazy loading of routes (future)
- Code splitting with Vite
- Image optimization
- Pagination (avoid loading all data)
- Debounced search
- Memoized components (future)

## 🐛 Troubleshooting

### API Connection Error
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in `.env`
- Check CORS configuration on backend

### Login Not Working
- Verify backend `/api/auth/login` endpoint
- Check credentials match backend data
- Check localStorage is enabled

### Charts Not Displaying
- Ensure Recharts is installed: `npm install recharts`
- Check data format matches chart expectations
- Verify container has height set

### Weather Widget Empty
- Get API key from openweathermap.org
- Set `VITE_WEATHER_KEY` in `.env`
- Check network tab for API calls

## 📝 Future Enhancements

- [ ] Add dark mode toggle
- [ ] Add export to PDF/Excel
- [ ] Add real-time notifications
- [ ] Add email notifications
- [ ] Add user profile settings
- [ ] Add request validation (Zod)
- [ ] Add unit tests (Vitest)
- [ ] Add E2E tests (Cypress)
- [ ] Add form state management (React Hook Form)
- [ ] Add animated page transitions
- [ ] Add offline support
- [ ] Add PWA capabilities

## 🔒 Security

- JWT tokens stored in localStorage
- API key for external services hidden in backend
- CORS enabled only for trusted origin
- No sensitive data in console
- Input validation on all forms
- XSS protection via React's default behavior

## 📄 License

MIT

---

**Built with ❤️ for FAST-NUCES Islamabad**
