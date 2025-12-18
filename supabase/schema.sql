-- =====================================================
-- ABIBSHOP DATABASE SCHEMA
-- Platform Top Up Roblox
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  discount INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id),
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_whatsapp TEXT,
  
  -- Product details
  product_id UUID REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  product_price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER DEFAULT 1,
  
  -- Game details
  game_username TEXT NOT NULL,
  game_user_id TEXT,
  
  -- Payment
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'expired')),
  
  -- Order status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'failed')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Additional data
  notes TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Order history/logs table
CREATE TABLE public.order_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  message TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_is_active ON public.products(is_active);
CREATE INDEX idx_products_is_featured ON public.products(is_featured);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX idx_orders_order_number ON public.orders(order_number);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_order_logs_order_id ON public.order_logs(order_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Products policies
CREATE POLICY "Products are viewable by everyone"
  ON public.products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Orders policies
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Anyone can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Order logs policies
CREATE POLICY "Users can view logs for own orders"
  ON public.order_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_id AND (user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
      ))
    )
  );

CREATE POLICY "Admins can create order logs"
  ON public.order_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Categories policies
CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_order_number TEXT;
BEGIN
  new_order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_trigger
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Create order log on status change
CREATE OR REPLACE FUNCTION create_order_log_on_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.order_logs (order_id, status, message, created_by)
    VALUES (NEW.id, NEW.status, 'Status changed from ' || OLD.status || ' to ' || NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_status_change_trigger
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION create_order_log_on_status_change();

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert default categories
INSERT INTO public.categories (name, slug, description, icon, color, sort_order) VALUES
  ('Robux', 'robux', 'Top up Robux untuk Roblox', '💎', 'from-blue-500 to-purple-500', 1),
  ('Game Pass', 'game-pass', 'Beli Game Pass Roblox', '🎮', 'from-purple-500 to-pink-500', 2),
  ('Premium', 'premium', 'Langganan Roblox Premium', '⭐', 'from-yellow-500 to-orange-500', 3);

-- Insert sample products
INSERT INTO public.products (name, description, category, price, original_price, discount, stock, is_featured, metadata) VALUES
  ('80 Robux', 'Top up 80 Robux instant', 'Robux', 15000, 20000, 25, 1000, true, '{"delivery_time": "instant", "bonus": 0}'),
  ('400 Robux', 'Top up 400 Robux instant', 'Robux', 70000, 85000, 18, 1000, true, '{"delivery_time": "instant", "bonus": 0}'),
  ('800 Robux', 'Top up 800 Robux instant + Bonus', 'Robux', 135000, 160000, 16, 1000, true, '{"delivery_time": "instant", "bonus": 50}'),
  ('1700 Robux', 'Top up 1700 Robux instant + Bonus', 'Robux', 270000, 320000, 16, 1000, true, '{"delivery_time": "instant", "bonus": 100}'),
  ('4500 Robux', 'Top up 4500 Robux instant + Bonus', 'Robux', 680000, 800000, 15, 500, false, '{"delivery_time": "instant", "bonus": 300}'),
  ('10000 Robux', 'Top up 10000 Robux instant + Bonus', 'Robux', 1450000, 1700000, 15, 500, false, '{"delivery_time": "instant", "bonus": 750}'),
  ('Premium 450 Robux/Month', 'Roblox Premium membership', 'Premium', 75000, 90000, 17, 100, false, '{"duration": "1 month", "robux_per_month": 450}'),
  ('Premium 1000 Robux/Month', 'Roblox Premium membership', 'Premium', 150000, 180000, 17, 100, false, '{"duration": "1 month", "robux_per_month": 1000}'),
  ('Premium 2200 Robux/Month', 'Roblox Premium membership', 'Premium', 300000, 360000, 17, 100, false, '{"duration": "1 month", "robux_per_month": 2200}');

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Storage policies for product images
CREATE POLICY "Product images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update product images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete product images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
