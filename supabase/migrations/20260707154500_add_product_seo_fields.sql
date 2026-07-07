alter table public.products
add column if not exists seo_title text,
add column if not exists meta_description text,
add column if not exists meta_keywords text;
