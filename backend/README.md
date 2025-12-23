# GlowCart Backend API

Backend API for GlowCart - Beauty & Skincare E-commerce Platform

## Features

- RESTful API with Express.js
- Supabase integration for database and authentication
- Product management (CRUD operations)
- Order processing and management
- Blog post management
- Quiz results storage
- User authentication via Supabase

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Update the following variables in `.env`:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for admin operations)
- `FRONTEND_URL`: Your frontend URL (default: http://localhost:5501)
- `PORT`: Backend server port (default: 5000)

### 3. Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL scripts from `models/database.js`:
   - First, run the table creation script (`createTablesSQL`)
   - Then, run the RLS policies script (`createRLSPoliciesSQL`)

Alternatively, you can use the Supabase migration system.

### 4. Seed Initial Data (Optional)

You can seed products and blog posts by creating a seed script or using the API endpoints.

### 5. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in `.env`).

## API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Products
- `GET /api/products` - Get all products (with optional filters: category, skinType, search, sort)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (authenticated)
- `PUT /api/products/:id` - Update product (authenticated)
- `DELETE /api/products/:id` - Delete product (authenticated)

### Orders
- `POST /api/orders` - Create new order (public)
- `GET /api/orders` - Get user's orders (authenticated)
- `GET /api/orders/:id` - Get single order (authenticated or by order number)
- `PATCH /api/orders/:id/status` - Update order status (authenticated)

### Blog Posts
- `GET /api/blog` - Get all blog posts (published only for non-authenticated)
- `GET /api/blog/:id` - Get single blog post
- `POST /api/blog` - Create blog post (authenticated)
- `PUT /api/blog/:id` - Update blog post (authenticated)
- `DELETE /api/blog/:id` - Delete blog post (authenticated)

### Quiz Results
- `POST /api/quiz/submit` - Submit quiz results (public with optional auth)
- `GET /api/quiz/results` - Get authenticated user's quiz results
- `GET /api/quiz/results/:userId` - Get specific user's quiz results (authenticated)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

**Note:** Supabase handles authentication directly. These endpoints are helper endpoints.

## Authentication

The API uses Supabase JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_supabase_jwt_token>
```

## Frontend Integration

Update your frontend JavaScript files to use the API endpoints:

```javascript
const API_URL = 'http://localhost:5000/api';

// Example: Fetch products
fetch(`${API_URL}/products`)
  .then(res => res.json())
  .then(data => console.log(data));
```

## Database Schema

### Products
- `id` (UUID)
- `name` (VARCHAR)
- `price` (DECIMAL)
- `category` (VARCHAR)
- `skin_type` (VARCHAR)
- `image` (TEXT)
- `description` (TEXT)
- `stock` (INTEGER)
- `created_at`, `updated_at` (TIMESTAMP)

### Orders
- `id` (UUID)
- `user_id` (UUID, nullable)
- `order_number` (VARCHAR, unique)
- `full_name`, `email`, `address`, `city`, `state`, `zip`
- `payment_method` (VARCHAR)
- `subtotal`, `shipping`, `total` (DECIMAL)
- `status` (VARCHAR)
- `created_at`, `updated_at` (TIMESTAMP)

### Order Items
- `id` (UUID)
- `order_id` (UUID, FK)
- `product_id` (UUID, FK, nullable)
- `product_name` (VARCHAR)
- `price`, `quantity`, `subtotal` (DECIMAL)
- `created_at` (TIMESTAMP)

### Blog Posts
- `id` (UUID)
- `title`, `category`, `read_time`
- `image`, `summary`, `content` (TEXT)
- `published` (BOOLEAN)
- `created_at`, `updated_at` (TIMESTAMP)

### Quiz Results
- `id` (UUID)
- `user_id` (UUID, nullable)
- `answers` (JSONB)
- `recommendations` (JSONB)
- `created_at` (TIMESTAMP)

## Development

### Project Structure

```
backend/
├── config/          # Configuration files
│   └── database.js  # Supabase client setup
├── controllers/     # Route controllers
│   ├── productController.js
│   ├── orderController.js
│   ├── blogController.js
│   └── quizController.js
├── middleware/      # Express middleware
│   ├── auth.js      # Authentication middleware
│   ├── errorHandler.js
│   └── validation.js
├── models/          # Database models/schemas
│   └── database.js  # SQL schema definitions
├── routes/          # API routes
│   ├── products.js
│   ├── orders.js
│   ├── blog.js
│   ├── quiz.js
│   └── auth.js
├── server.js        # Main application file
├── package.json
├── .env.example
└── README.md
```

## Error Handling

All errors are returned in a consistent format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Security

- Helmet.js for security headers
- CORS configured for frontend domain
- Row Level Security (RLS) enabled on all Supabase tables
- JWT token validation for protected routes
- Input validation using express-validator

## License

ISC

