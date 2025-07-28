# Delivery & Sales Profit Tracking System

A full-stack web application for delivery business owners to track sales income, delivery fees, expenses, and manage debtors with comprehensive analytics and reporting.

## 🚀 Features

### Core Features
- **User Authentication** - Secure login with JWT tokens
- **Transaction Management** - Add, edit, delete sales, delivery fees, and expenses
- **Debtor Management** - Track clients who owe money with due dates
- **Analytics Dashboard** - Real-time financial insights with charts
- **Mobile-First Design** - Optimized for mobile phones and tablets
- **Responsive UI** - Works seamlessly on all screen sizes

### Analytics & Reporting
- **Daily/Weekly/Monthly Reports** - Filter data by time periods
- **Income vs Expenses Charts** - Visual comparison of revenue and costs
- **Profit Trend Analysis** - Track profitability over time
- **Expense Breakdown** - Categorize and analyze expenses
- **Debtor Status Tracking** - Monitor payment status and overdue accounts

### Data Management
- **Backdating Support** - Enter transactions with actual event dates
- **Audit Trail** - Track when records were entered vs. when events occurred
- **Data Export** - Export reports to CSV (future feature)
- **Search & Filter** - Find specific transactions and debtors

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Recharts** - Chart library
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **Lucide React** - Icon library

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd delivery-profit-tracker
```

### 2. Install Dependencies

```bash
# Install all dependencies (backend + frontend)
npm run install-all

# Or install separately:
npm install
cd server && npm install
cd ../client && npm install
```

### 3. Environment Setup

#### Backend Environment
Create a `.env` file in the `server` directory:

```bash
cd server
cp env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/delivery-profit-tracker
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/delivery-profit-tracker

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

### 4. Start the Application

#### Development Mode (Both Backend & Frontend)
```bash
npm run dev
```

#### Start Backend Only
```bash
npm run server
```

#### Start Frontend Only
```bash
npm run client
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 📱 Usage Guide

### 1. First Time Setup
1. Open the application in your browser
2. Click "Create Account" to register
3. Enter your business details
4. Start adding your transactions

### 2. Adding Transactions
- **Sales**: Record income from product sales
- **Delivery Fees**: Track delivery service income
- **Expenses**: Categorize costs (fuel, driver, repairs, etc.)

### 3. Managing Debtors
- Add clients who owe money
- Set due dates for payments
- Mark payments as received
- Track overdue accounts

### 4. Viewing Analytics
- **Dashboard**: Overview of current period
- **Reports**: Detailed analysis with charts
- **Filter by**: Day, week, month, or custom date range

## 🗄️ Database Schema

### User Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (default: "owner"),
  createdAt: Date
}
```

### Transaction Collection
```javascript
{
  type: String (enum: "sale", "delivery_fee", "expense"),
  category: String (for expenses only),
  amount: Number,
  description: String (optional),
  transactionDate: Date,
  entryDate: Date,
  createdBy: ObjectId (ref: User)
}
```

### Debtor Collection
```javascript
{
  clientName: String,
  amount: Number,
  dueDate: Date,
  status: String (enum: "unpaid", "paid"),
  transactionDate: Date,
  entryDate: Date,
  createdBy: ObjectId (ref: User)
}
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/analytics` - Get analytics

### Debtors
- `GET /api/debtors` - Get all debtors
- `POST /api/debtors` - Create debtor
- `PUT /api/debtors/:id` - Update debtor
- `PATCH /api/debtors/:id/mark-paid` - Mark as paid
- `DELETE /api/debtors/:id` - Delete debtor
- `GET /api/debtors/analytics` - Get debtor analytics

## 🚀 Deployment

### Backend Deployment (Render/Railway)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy the `server` directory

### Frontend Deployment (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `build`
4. Add environment variable: `REACT_APP_API_URL`

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in environment variables

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password security
- **Input Validation** - Server-side validation for all inputs
- **CORS Protection** - Configured for production
- **Helmet.js** - Security headers
- **Rate Limiting** - Protection against abuse

## 📊 Analytics Features

- **Real-time Calculations** - Instant profit/loss calculations
- **Visual Charts** - Bar charts, line charts, pie charts
- **Date Filtering** - Filter by day, week, month, or custom range
- **Category Analysis** - Expense breakdown by category
- **Trend Analysis** - Track performance over time

## 🎨 UI/UX Features

- **Mobile-First Design** - Optimized for mobile phones
- **Responsive Layout** - Works on all screen sizes
- **Dark/Light Mode Ready** - Easy to implement themes
- **Accessibility** - WCAG compliant components
- **Loading States** - Smooth user experience
- **Error Handling** - User-friendly error messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔮 Future Enhancements

- [ ] Data export to CSV/PDF
- [ ] Email notifications for overdue debtors
- [ ] Multi-currency support
- [ ] Advanced reporting features
- [ ] Mobile app (React Native)
- [ ] Integration with accounting software
- [ ] Automated backup system
- [ ] Multi-user support with roles

---

**Built with ❤️ for delivery business owners** 