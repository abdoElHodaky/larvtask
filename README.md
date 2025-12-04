# 🛒 Laravel-Vue.js E-Commerce Platform

A comprehensive full-stack e-commerce application built with Laravel 12 and Vue.js 3, featuring a complete shopping cart system, order management, and modern responsive design.

## 🎯 Project Overview

This project is a production-ready e-commerce platform that demonstrates modern full-stack development practices. It includes user authentication, product management, shopping cart functionality, order processing, and an admin dashboard with live statistics.

### ✨ Key Features

- **🔐 JWT Authentication** - Secure user registration, login, and session management
- **📦 Product Management** - Complete CRUD operations with stock tracking
- **🛒 Smart Shopping Cart** - Persistent cart with intelligent quantity merging
- **📋 Order Processing** - Seamless checkout with stock validation and order history
- **📊 Admin Dashboard** - Live statistics and recent orders overview
- **📱 Responsive Design** - Mobile-first approach with Tailwind CSS
- **🔒 Security** - Input validation, authorization checks, and XSS protection
- **⚡ Performance** - Optimized database queries and efficient state management

## 🏗️ Architecture

### Backend (Laravel 12)
- **Framework**: Laravel 12 with PHP 8.2
- **Authentication**: JWT tokens via tymon/jwt-auth
- **Database**: MySQL with Eloquent ORM
- **API**: RESTful API with 19 endpoints
- **Validation**: Comprehensive request validation and error handling

### Frontend (Vue.js 3)
- **Framework**: Vue 3 with Composition API
- **Language**: TypeScript for type safety
- **State Management**: Pinia for reactive state
- **Styling**: Tailwind CSS with responsive design
- **Build Tool**: Vite for fast development and optimized builds

### Database Schema
```
users (id, name, email, password, timestamps)
products (id, name, description, price, stock, status, timestamps)
orders (id, user_id, order_number, total, address, phone, status, timestamps)
order_items (id, order_id, product_id, quantity, price, timestamps)
cart_items (id, user_id, product_id, quantity, timestamps)
```

## 🚀 Quick Start

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js 20.19+ or 22.12+
- MySQL 8.0+
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/abdoElHodaky/larvtask.git
   cd larvtask/backend
   ```

2. **Install dependencies**
   ```bash
   composer install
   ```

3. **Environment configuration**
   ```bash
   cp .env.example .env
   php artisan key:generate
   php artisan jwt:secret
   ```

4. **Configure database in `.env`**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=larvtask
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

5. **Run migrations**
   ```bash
   php artisan migrate
   ```

6. **Start the server**
   ```bash
   php artisan serve
   ```
   Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   Create `.env.local` file:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get User Profile
```http
GET /api/auth/me
Authorization: Bearer {jwt_token}
```

#### Refresh Token
```http
POST /api/auth/refresh
Authorization: Bearer {jwt_token}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {jwt_token}
```

### Product Endpoints

#### List Products
```http
GET /api/products?page=1&search=laptop&status=active&per_page=15
Authorization: Bearer {jwt_token}
```

#### Create Product
```http
POST /api/products
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "Gaming Laptop",
  "description": "High-performance gaming laptop",
  "price": 1299.99,
  "stock": 10,
  "status": "active"
}
```

#### Update Product
```http
PUT /api/products/{id}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "name": "Updated Product Name",
  "price": 1399.99,
  "stock": 15
}
```

#### Delete Product
```http
DELETE /api/products/{id}
Authorization: Bearer {jwt_token}
```

### Cart Endpoints

#### Get Cart
```http
GET /api/cart
Authorization: Bearer {jwt_token}
```

#### Add to Cart
```http
POST /api/cart
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 2
}
```

#### Update Cart Item
```http
PUT /api/cart/{cart_item_id}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remove Cart Item
```http
DELETE /api/cart/{cart_item_id}
Authorization: Bearer {jwt_token}
```

#### Clear Cart
```http
DELETE /api/cart
Authorization: Bearer {jwt_token}
```

### Order Endpoints

#### Create Order
```http
POST /api/orders
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "address": "123 Main St, City, State 12345",
  "phone": "+1234567890",
  "use_cart": true
}
```

#### List Orders
```http
GET /api/orders?page=1&status=pending
Authorization: Bearer {jwt_token}
```

#### Get Order Details
```http
GET /api/orders/{order_id}
Authorization: Bearer {jwt_token}
```

### Dashboard Endpoint

#### Get Statistics
```http
GET /api/dashboard/stats
Authorization: Bearer {jwt_token}
```

## 🎨 Frontend Components

### Key Views
- **LoginView** - User authentication
- **RegisterView** - User registration
- **DashboardView** - Admin dashboard with statistics
- **ProductsView** - Product management with CRUD operations
- **CartView** - Shopping cart with quantity controls
- **OrdersView** - Order history and management
- **OrderDetailsView** - Detailed order information

### State Management (Pinia Stores)
- **authStore** - User authentication state
- **cartStore** - Shopping cart state and operations

### Reusable Components
- **AppLayout** - Main application layout with navigation
- **LoadingSpinner** - Loading state indicator
- **AlertMessage** - Success/error message display
- **ProductFormModal** - Product creation/editing modal
- **CheckoutModal** - Order checkout form
- **DeleteConfirmModal** - Confirmation dialog for deletions

## 🔧 Configuration

### Environment Variables (Backend)

```env
# Application
APP_NAME="Laravel E-Commerce"
APP_ENV=local
APP_KEY=base64:generated_key
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=larvtask
DB_USERNAME=root
DB_PASSWORD=

# JWT
JWT_SECRET=generated_secret
JWT_TTL=60
JWT_REFRESH_TTL=20160

# CORS
SANCTUM_STATEFUL_DOMAINS=localhost:5173
```

### Environment Variables (Frontend)

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# Application
VITE_APP_NAME="E-Commerce Platform"
```

## 🗄️ Database Design

### Relationships
- **User** → **CartItems** (One-to-Many)
- **User** → **Orders** (One-to-Many)
- **Product** → **CartItems** (One-to-Many)
- **Product** → **OrderItems** (One-to-Many)
- **Order** → **OrderItems** (One-to-Many)

### Key Constraints
- **cart_items**: Unique constraint on (user_id, product_id)
- **Foreign keys**: Cascade delete for data integrity
- **Indexes**: Performance optimization on frequently queried columns

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based authentication
- **Input Validation** - Comprehensive request validation
- **Authorization Checks** - User-specific data access control
- **XSS Protection** - Vue.js automatic escaping
- **SQL Injection Prevention** - Eloquent ORM parameterized queries
- **CORS Configuration** - Controlled cross-origin requests

## 🚀 Deployment

### Production Build

#### Backend
```bash
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

#### Frontend
```bash
npm run build
```

### Server Requirements
- **PHP**: 8.2+ with extensions (BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML)
- **Web Server**: Apache/Nginx
- **Database**: MySQL 8.0+ or PostgreSQL 13+
- **Node.js**: 20.19+ (for building frontend)

### Environment Setup
1. Configure web server to point to `backend/public`
2. Set up database and run migrations
3. Configure environment variables for production
4. Set up SSL certificate for HTTPS
5. Configure caching (Redis recommended)

## 🧪 Testing

### Backend Testing
```bash
cd backend
php artisan test
```

### Frontend Testing
```bash
cd frontend
npm run test
```

## 📈 Performance Optimization

### Backend
- **Database Indexing** - Optimized queries with proper indexes
- **Eager Loading** - Prevent N+1 query problems
- **Caching** - Route, config, and view caching
- **Queue Jobs** - Asynchronous processing for heavy operations

### Frontend
- **Code Splitting** - Lazy loading of routes and components
- **Tree Shaking** - Eliminate unused code
- **Asset Optimization** - Minification and compression
- **State Management** - Efficient reactive updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow PSR-12 coding standards for PHP
- Use TypeScript for all frontend code
- Write comprehensive tests for new features
- Update documentation for API changes
- Ensure responsive design for UI components

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Laravel Framework for robust backend architecture
- Vue.js for reactive frontend development
- Tailwind CSS for utility-first styling
- JWT Auth for secure authentication
- Pinia for state management

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation for common solutions
- Review the API documentation for endpoint details

---

**Built with ❤️ using Laravel 12 and Vue.js 3**
