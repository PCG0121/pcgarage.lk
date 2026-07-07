insert into public.categories (name, slug)
values
  ('Laptops', 'laptops'),
  ('WiFi Camera', 'wifi-camera'),
  ('Power bank', 'power-bank'),
  ('Toner & Ink', 'toner-ink'),
  ('Software', 'software')
on conflict (slug) do update set name = excluded.name;
