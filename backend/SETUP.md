# GlowCart Backend Setup Guide

## Quick Start

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Create Environment File

Create a `.env` file in the `backend` directory (copy from `.env.example`):

```bash
cp .env.example .env
```

### Step 3: Get Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or select an existing one
3. Go to **Settings** → **API**
4. Copy the following:
   - **Project URL** → `SUPABASE_URL`
   - **anon public key** → `SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### Step 4: Configure `.env` File

Update your `.env` file with your Supabase credentials:

```env
PORT=5000
NODE_ENV=development

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

FRONTEND_URL=http://localhost:5501
JWT_SECRET=your_jwt_secret_here
```

### Step 5: Set Up Database Tables

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the SQL from `models/database.js`:

#### First, run the table creation:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  skin_type VARCHAR(50) NOT NULL,
  image TEXT,
  description TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  read_time VARCHAR(50),
  image TEXT,
  summary TEXT,
  content TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip VARCHAR(20) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz results table
CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  answers JSONB NOT NULL,
  recommendations JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_skin_type ON products(skin_type);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

5. Click **Run** to execute the SQL

#### Then, run the RLS policies:

```sql
-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Products policies
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Products are insertable by authenticated users" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Blog posts policies
CREATE POLICY "Published blog posts are viewable by everyone" ON blog_posts
  FOR SELECT USING (published = true OR auth.role() = 'authenticated');

-- Orders policies
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Order items policies
CREATE POLICY "Users can view items from their own orders" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
    )
  );

CREATE POLICY "Order items can be inserted with orders" ON order_items
  FOR INSERT WITH CHECK (true);

-- Quiz results policies
CREATE POLICY "Users can view their own quiz results" ON quiz_results
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can create quiz results" ON quiz_results
  FOR INSERT WITH CHECK (true);
```

### Step 6: Seed Initial Data (Optional)

Seed your database with sample products and blog posts:

```bash
npm run seed
```

This will populate your database with:
- 9 sample products
- 3 sample blog posts

### Step 7: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

### Step 8: Test the API

Open your browser or use curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Get all products
curl http://localhost:5000/api/products

# Get all blog posts
curl http://localhost:5000/api/blog
```

## Verifying Setup

1. ✅ Server starts without errors
2. ✅ Health endpoint returns `{"status": "OK"}`
3. ✅ Products endpoint returns data (if seeded)
4. ✅ Blog endpoint returns data (if seeded)

## Troubleshooting

### Connection Issues

- Verify your Supabase URL and keys are correct
- Check that your Supabase project is active
- Ensure database tables are created

### Authentication Issues

- Make sure you're using the correct keys (anon vs service_role)
- Verify JWT tokens are being sent correctly in headers
- Check Supabase RLS policies if you get permission errors

### Port Already in Use

Change the PORT in `.env` if 5000 is already taken.

## Next Steps

- Update your frontend to use the API endpoints
- Set up authentication in your frontend
- Configure CORS if frontend is on a different domain
- Set up environment variables in your hosting platform (Vercel, Heroku, etc.)

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Update `FRONTEND_URL` to your production frontend URL
3. Use environment variables from your hosting platform
4. Ensure Supabase production keys are used
5. Set up proper CORS configuration

