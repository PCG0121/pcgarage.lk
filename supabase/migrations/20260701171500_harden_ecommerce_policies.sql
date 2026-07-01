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
