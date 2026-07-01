create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  price numeric not null,
  category_id uuid references public.categories(id) on delete set null,
  image_url text,
  sku text,
  warranty text,
  stock_quantity integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  address text,
  city text,
  items jsonb not null,
  total numeric not null,
  status text default 'pending',
  created_at timestamp with time zone not null default now()
);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text unique not null,
  role text default 'admin',
  created_at timestamp with time zone not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where admin_users.user_id = uid
  );
$$;

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "Anyone can select categories" on public.categories;
create policy "Anyone can select categories"
on public.categories for select
using (true);

drop policy if exists "Admins can insert categories" on public.categories;
create policy "Admins can insert categories"
on public.categories for insert
with check (public.is_admin(auth.uid()));

drop policy if exists "Admins can update categories" on public.categories;
create policy "Admins can update categories"
on public.categories for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Admins can delete categories" on public.categories;
create policy "Admins can delete categories"
on public.categories for delete
using (public.is_admin(auth.uid()));

drop policy if exists "Anyone can select active products" on public.products;
create policy "Anyone can select active products"
on public.products for select
using (is_active = true);

drop policy if exists "Admins can select all products" on public.products;
create policy "Admins can select all products"
on public.products for select
using (public.is_admin(auth.uid()));

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
on public.products for insert
with check (public.is_admin(auth.uid()));

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
on public.products for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
on public.products for delete
using (public.is_admin(auth.uid()));

drop policy if exists "Anyone can insert orders" on public.orders;
create policy "Anyone can insert orders"
on public.orders for insert
with check (true);

drop policy if exists "Admins can select orders" on public.orders;
create policy "Admins can select orders"
on public.orders for select
using (public.is_admin(auth.uid()));

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders"
on public.orders for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Admins can select admin users" on public.admin_users;
create policy "Admins can select admin users"
on public.admin_users for select
using (public.is_admin(auth.uid()));

drop policy if exists "Admins can insert admin users" on public.admin_users;
create policy "Admins can insert admin users"
on public.admin_users for insert
with check (public.is_admin(auth.uid()));

drop policy if exists "Admins can update admin users" on public.admin_users;
create policy "Admins can update admin users"
on public.admin_users for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Admins can delete admin users" on public.admin_users;
create policy "Admins can delete admin users"
on public.admin_users for delete
using (public.is_admin(auth.uid()));

insert into public.categories (name, slug)
values
  ('Laptop Batteries', 'laptop-batteries'),
  ('Keyboards', 'keyboards'),
  ('Displays', 'displays'),
  ('SSD', 'ssd'),
  ('RAM', 'ram'),
  ('Chargers', 'chargers'),
  ('Printers', 'printers'),
  ('Accessories', 'accessories')
on conflict (slug) do update set name = excluded.name;

insert into public.products (name, slug, description, price, category_id, image_url, sku, warranty, stock_quantity, is_active)
values
  (
    'HP Pavilion 15 Battery (Original)',
    'hp-pavilion-15-battery-original',
    'Genuine OEM replacement battery for HP Pavilion 15 series. 3-cell, 41Wh.',
    8500,
    (select id from public.categories where slug = 'laptop-batteries'),
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    'HP-PAV-15-BAT',
    '6 months warranty',
    5,
    true
  ),
  (
    'Logitech MX Master 3S',
    'logitech-mx-master-3s',
    'Wireless performance mouse with ultrafast scrolling and ergonomic design.',
    24500,
    (select id from public.categories where slug = 'accessories'),
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800',
    'LOGI-MX-3S',
    '1 year warranty',
    4,
    true
  ),
  (
    'Samsung 980 PRO 1TB PCIe 4.0 NVMe SSD',
    'samsung-980-pro-1tb-pcie-4-nvme-ssd',
    'Next-level SSD performance with read speeds up to 7,000 MB/s.',
    28000,
    (select id from public.categories where slug = 'ssd'),
    'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&q=80&w=800',
    'SAM-980PRO-1TB',
    '3 years warranty',
    6,
    true
  ),
  (
    'Corsair Vengeance LPX 16GB (2x8GB) DDR4',
    'corsair-vengeance-lpx-16gb-ddr4',
    'High-performance memory designed for overclocking.',
    14500,
    (select id from public.categories where slug = 'ram'),
    'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=800',
    'COR-LPX-16GB',
    'Lifetime limited warranty',
    7,
    true
  ),
  (
    'Dell 15.6" FHD Replacement Display Panel',
    'dell-15-6-fhd-replacement-display-panel',
    '1920x1080 IPS matte replacement screen for Dell laptops.',
    18000,
    (select id from public.categories where slug = 'displays'),
    'https://images.unsplash.com/photo-1527443154391-4272802d3345?auto=format&fit=crop&q=80&w=800',
    'DELL-FHD-156',
    '3 months warranty',
    3,
    true
  ),
  (
    'Keychron K2 Wireless Mechanical Keyboard',
    'keychron-k2-wireless-mechanical-keyboard',
    'A 75% layout wireless mechanical keyboard with tactile brown switches.',
    22000,
    (select id from public.categories where slug = 'keyboards'),
    'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800',
    'KEY-K2-BROWN',
    '1 year warranty',
    4,
    true
  )
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  category_id = excluded.category_id,
  image_url = excluded.image_url,
  sku = excluded.sku,
  warranty = excluded.warranty,
  stock_quantity = excluded.stock_quantity,
  is_active = excluded.is_active;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Anyone can view product images" on storage.objects;
create policy "Anyone can view product images"
on storage.objects for select
using (bucket_id = 'product-images');

drop policy if exists "Admins can insert product images" on storage.objects;
create policy "Admins can insert product images"
on storage.objects for insert
with check (bucket_id = 'product-images' and public.is_admin(auth.uid()));

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
on storage.objects for update
using (bucket_id = 'product-images' and public.is_admin(auth.uid()))
with check (bucket_id = 'product-images' and public.is_admin(auth.uid()));

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
on storage.objects for delete
using (bucket_id = 'product-images' and public.is_admin(auth.uid()));

-- Bootstrap note:
-- 1. Create an admin user in Supabase Authentication.
-- 2. Copy the Auth user UUID.
-- 3. Run this in the SQL editor, replacing the values:
-- insert into public.admin_users (user_id, email)
-- values ('AUTH_USER_UUID_HERE', 'admin@pcgarage.lk');
