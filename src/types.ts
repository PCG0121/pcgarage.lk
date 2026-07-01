export type Category = string;

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Product {
  id: string;
  slug?: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  category_id?: string | null;
  image_url: string;
  in_stock: boolean;
  stock_quantity?: number;
  sku?: string;
  warranty?: string;
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  address?: string | null;
  city?: string | null;
  items: OrderItemSnapshot[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | string;
  created_at: string;
}

export interface OrderItemSnapshot {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
  sku?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
}
