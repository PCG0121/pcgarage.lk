import { create } from 'zustand';
import { categories as fallbackCategories, mockProducts } from '../data/mock';
import { hasSupabaseConfig, supabase } from '../lib/supabase';
import type { CategoryRecord, Product } from '../types';

type ProductInput = {
  name: string;
  slug?: string;
  description: string;
  price: number;
  category_id?: string | null;
  category?: string;
  image_url: string;
  sku?: string;
  warranty?: string;
  stock_quantity: number;
  is_active?: boolean;
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | string;
  category_id: string | null;
  image_url: string | null;
  sku: string | null;
  warranty: string | null;
  stock_quantity: number | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string | null;
  categories?: { name: string } | { name: string }[] | null;
};

interface ProductState {
  products: Product[];
  categories: CategoryRecord[];
  isLoading: boolean;
  error: string | null;
  isUsingFallback: boolean;
  loadProducts: () => Promise<void>;
  loadAdminProducts: () => Promise<void>;
  addProduct: (product: ProductInput) => Promise<void>;
  updateProduct: (productId: string, product: ProductInput) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  resetProducts: () => void;
}

const fallbackCategoryRecords: CategoryRecord[] = fallbackCategories.map((name) => ({
  id: name,
  name,
  slug: slugify(name),
  created_at: new Date().toISOString(),
}));

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getCategoryName(row: ProductRow) {
  const category = Array.isArray(row.categories) ? row.categories[0] : row.categories;
  return category?.name || 'Accessories';
}

function mapProduct(row: ProductRow): Product {
  const stockQuantity = row.stock_quantity ?? 0;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description || 'Product details will be updated soon.',
    price: Number(row.price),
    category: getCategoryName(row),
    category_id: row.category_id,
    image_url: row.image_url || '',
    sku: row.sku || undefined,
    warranty: row.warranty || undefined,
    stock_quantity: stockQuantity,
    in_stock: stockQuantity > 0,
    is_active: row.is_active ?? true,
    created_at: row.created_at,
    updated_at: row.updated_at || undefined,
  };
}

function productToRow(product: ProductInput) {
  return {
    name: product.name.trim(),
    slug: product.slug?.trim() || slugify(product.name),
    description: product.description.trim(),
    price: product.price,
    category_id: product.category_id || null,
    image_url: product.image_url.trim(),
    sku: product.sku?.trim() || null,
    warranty: product.warranty?.trim() || null,
    stock_quantity: product.stock_quantity,
    is_active: product.is_active ?? true,
  };
}

export const useProductStore = create<ProductState>()((set, get) => ({
  products: hasSupabaseConfig ? [] : mockProducts,
  categories: hasSupabaseConfig ? [] : fallbackCategoryRecords,
  isLoading: false,
  error: null,
  isUsingFallback: !hasSupabaseConfig,

  loadProducts: async () => {
    if (!supabase) {
      set({
        products: mockProducts,
        categories: fallbackCategoryRecords,
        isUsingFallback: true,
        isLoading: false,
        error: null,
      });
      return;
    }

    set({ isLoading: true, error: null, isUsingFallback: false });

    const [{ data: categoryData, error: categoryError }, { data: productData, error: productError }] = await Promise.all([
      supabase.from('categories').select('id,name,slug,created_at').order('name'),
      supabase
        .from('products')
        .select('id,name,slug,description,price,category_id,image_url,sku,warranty,stock_quantity,is_active,created_at,updated_at,categories(name)')
        .eq('is_active', true)
        .order('created_at', { ascending: false }),
    ]);

    if (categoryError || productError) {
      set({
        products: [],
        categories: [],
        isUsingFallback: false,
        isLoading: false,
        error: categoryError?.message || productError?.message || 'Could not load products.',
      });
      return;
    }

    set({
      categories: (categoryData as CategoryRecord[] | null) || fallbackCategoryRecords,
      products: ((productData as ProductRow[] | null) || []).map(mapProduct),
      isLoading: false,
      error: null,
    });
  },

  loadAdminProducts: async () => {
    if (!supabase) {
      set({
        products: mockProducts,
        categories: fallbackCategoryRecords,
        isUsingFallback: true,
        isLoading: false,
        error: null,
      });
      return;
    }

    set({ isLoading: true, error: null, isUsingFallback: false });

    const [{ data: categoryData, error: categoryError }, { data: productData, error: productError }] = await Promise.all([
      supabase.from('categories').select('id,name,slug,created_at').order('name'),
      supabase
        .from('products')
        .select('id,name,slug,description,price,category_id,image_url,sku,warranty,stock_quantity,is_active,created_at,updated_at,categories(name)')
        .order('created_at', { ascending: false }),
    ]);

    if (categoryError || productError) {
      set({
        products: [],
        categories: [],
        isUsingFallback: false,
        isLoading: false,
        error: categoryError?.message || productError?.message || 'Could not load admin products.',
      });
      return;
    }

    set({
      categories: (categoryData as CategoryRecord[] | null) || fallbackCategoryRecords,
      products: ((productData as ProductRow[] | null) || []).map(mapProduct),
      isLoading: false,
      error: null,
    });
  },

  addProduct: async (product) => {
    if (!supabase) {
      const categoryName = product.category || fallbackCategories[0];
      const fallbackProduct: Product = {
        id: crypto.randomUUID(),
        slug: product.slug || slugify(product.name),
        name: product.name,
        description: product.description,
        price: product.price,
        category: categoryName,
        category_id: product.category_id || categoryName,
        image_url: product.image_url,
        sku: product.sku,
        warranty: product.warranty,
        stock_quantity: product.stock_quantity,
        in_stock: product.stock_quantity > 0,
        is_active: product.is_active ?? true,
        created_at: new Date().toISOString(),
      };
      set((state) => ({ products: [fallbackProduct, ...state.products] }));
      return;
    }

    const { error } = await supabase.from('products').insert(productToRow(product));
    if (error) throw error;
    await get().loadAdminProducts();
  },

  updateProduct: async (productId, product) => {
    if (!supabase) {
      set((state) => ({
        products: state.products.map((existing) =>
          existing.id === productId
            ? {
                ...existing,
                ...product,
                slug: product.slug || slugify(product.name),
                category: product.category || existing.category,
                in_stock: product.stock_quantity > 0,
                updated_at: new Date().toISOString(),
              }
            : existing
        ),
      }));
      return;
    }

    const { error } = await supabase.from('products').update(productToRow(product)).eq('id', productId);
    if (error) throw error;
    await get().loadAdminProducts();
  },

  deleteProduct: async (productId) => {
    if (!supabase) {
      set((state) => ({
        products: state.products.filter((product) => product.id !== productId),
      }));
      return;
    }

    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) throw error;
    await get().loadAdminProducts();
  },

  resetProducts: () => {
    set({
      products: mockProducts,
      categories: fallbackCategoryRecords,
      isUsingFallback: true,
      error: null,
    });
  },
}));
