create extension if not exists pgcrypto;

create schema if not exists private;
revoke all on schema private from public;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  price numeric(12, 2) not null check (price >= 0),
  category_id uuid references public.categories(id) on delete set null,
  image_url text not null default '',
  gallery_image_urls text[] not null default '{}',
  sku text,
  warranty text,
  seo_title text,
  meta_description text,
  meta_keywords text,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  address text,
  city text,
  items jsonb not null check (jsonb_typeof(items) = 'array'),
  total numeric(12, 2) not null check (total >= 0),
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'cancelled')),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'admin',
  created_at timestamp with time zone not null default now()
);

create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_is_active_created_at_idx on public.products(is_active, created_at desc);
create index if not exists products_slug_idx on public.products(slug);
create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists admin_users_user_id_idx on public.admin_users(user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog
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

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where admin_users.user_id = auth.uid()
  );
$$;

revoke all on function private.is_admin() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
on public.categories
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert categories" on public.categories;
create policy "Admins can insert categories"
on public.categories
for insert
to authenticated
with check (private.is_admin());

drop policy if exists "Admins can update categories" on public.categories;
create policy "Admins can update categories"
on public.categories
for update
to authenticated
using (private.is_admin())
with check (private.is_admin());

drop policy if exists "Admins can delete categories" on public.categories;
create policy "Admins can delete categories"
on public.categories
for delete
to authenticated
using (private.is_admin());

drop policy if exists "Public can read active products" on public.products;
drop policy if exists "Admins can read all products" on public.products;
drop policy if exists "Anon can read active products" on public.products;
drop policy if exists "Authenticated can read active or admin products" on public.products;
create policy "Anon can read active products"
on public.products
for select
to anon
using (is_active = true);

create policy "Authenticated can read active or admin products"
on public.products
for select
to authenticated
using (is_active = true or private.is_admin());

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
on public.products
for insert
to authenticated
with check (private.is_admin());

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
on public.products
for update
to authenticated
using (private.is_admin())
with check (private.is_admin());

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
on public.products
for delete
to authenticated
using (private.is_admin());

drop policy if exists "Public can insert orders" on public.orders;
create policy "Public can insert orders"
on public.orders
for insert
to anon, authenticated
with check (
  length(trim(customer_name)) > 0
  and length(trim(phone)) > 0
  and jsonb_typeof(items) = 'array'
  and jsonb_array_length(items) > 0
  and total >= 0
  and status = 'pending'
);

drop policy if exists "Admins can read orders" on public.orders;
create policy "Admins can read orders"
on public.orders
for select
to authenticated
using (private.is_admin());

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders"
on public.orders
for update
to authenticated
using (private.is_admin())
with check (private.is_admin());

drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users"
on public.admin_users
for select
to authenticated
using (private.is_admin());

drop policy if exists "Admins can insert admin users" on public.admin_users;
create policy "Admins can insert admin users"
on public.admin_users
for insert
to authenticated
with check (private.is_admin());

drop policy if exists "Admins can update admin users" on public.admin_users;
create policy "Admins can update admin users"
on public.admin_users
for update
to authenticated
using (private.is_admin())
with check (private.is_admin());

drop policy if exists "Admins can delete admin users" on public.admin_users;
create policy "Admins can delete admin users"
on public.admin_users
for delete
to authenticated
using (private.is_admin());

grant usage on schema public to anon, authenticated;
grant select on public.categories to anon, authenticated;
grant select on public.products to anon, authenticated;
grant insert on public.orders to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;
grant insert, update, delete on public.products to authenticated;
grant select, update on public.orders to authenticated;
grant select, insert, update, delete on public.admin_users to authenticated;

insert into public.categories (name, slug)
values
  ('Laptop Batteries', 'laptop-batteries'),
  ('Keyboards', 'keyboards'),
  ('Displays', 'displays'),
  ('SSD', 'ssd'),
  ('RAM', 'ram'),
  ('Chargers', 'chargers'),
  ('Printers', 'printers'),
  ('Laptops', 'laptops'),
  ('WiFi Camera', 'wifi-camera'),
  ('Power bank', 'power-bank'),
  ('Toner & Ink', 'toner-ink'),
  ('Software', 'software'),
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

-- Bootstrap note:
-- 1. Create an admin user in Supabase Authentication.
-- 2. Copy the Auth user UUID.
-- 3. Run this in the SQL editor, replacing the values:
-- insert into public.admin_users (user_id, email)
-- values ('AUTH_USER_UUID_HERE', 'admin@pcgarage.lk');
