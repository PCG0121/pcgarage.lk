# PC Garage Sri Lanka

PC Garage Sri Lanka is a React + Vite storefront for computer parts and accessories. It includes a Supabase-backed product catalog, category filtering, cart, WhatsApp checkout, Supabase order storage, and an authenticated admin dashboard for products and orders.

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Zustand for app/cart state
- Tailwind CSS utilities
- Supabase database and auth
- WhatsApp order redirect

## Prerequisites

Install these before running the app:

- Node.js 20 or newer
- npm

## Setup

Install project dependencies:

```bash
npm install
```

Create a local environment file in the project root, at the same level as `package.json`:

```bash
cp .env.example .env.local
```

On Windows PowerShell, you can use:

```powershell
Copy-Item .env.example .env.local
```

Update `.env.local` with your values:

```env
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"
VITE_WHATSAPP_NUMBER="94711479191"
```

`VITE_WHATSAPP_NUMBER` must use country code format without `+`, spaces, or dashes. Example: `94771234567`.

The app uses Supabase when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured in `.env.local`. If they are missing, public product screens fall back to demo data from `src/data/mock.ts` for local preview only, and admin screens show a setup message instead of trying to sign in.

After creating or changing `.env.local`, restart the Vite dev server. Vite reads environment variables when the server starts.

## Run Locally

Start the development server:

```bash
npm run dev
```

Open the app in your browser:

```text
http://127.0.0.1:5173
```

## Available Scripts

```bash
npm run dev
```

Runs the Vite development server on `127.0.0.1:5173`.

```bash
npm run build
```

Builds the production version into the `dist` folder.

```bash
npm run preview
```

Previews the production build locally.

```bash
npm run lint
```

Runs TypeScript checks with `tsc --noEmit`.

## Main Pages

- `/` - Home page
- `/categories` - Product categories
- `/products` - Product listing with search, category filters, and sorting
- `/product/:id` - Product detail page
- `/cart` - Shopping cart
- `/checkout` - Customer details and WhatsApp checkout
- `/admin` - Supabase Auth admin login
- `/admin/dashboard` - Admin dashboard
- `/admin/products` - Admin product management
- `/admin/orders` - Admin orders page

## Admin Login

The admin area is intentionally hidden from the public website navigation. Open `/admin` directly to sign in.

Admin login uses Supabase Auth. A user can access admin pages only when their Auth user id is listed in the `admin_users` table.

## How Checkout Works

1. Customer adds products to cart.
2. Customer enters name, phone, address, and city on the checkout page.
3. The app inserts the order into the Supabase `orders` table.
4. The app creates a WhatsApp message with the order details.
5. Customer is redirected to `https://wa.me/...` using `VITE_WHATSAPP_NUMBER`.

## Supabase Setup

Create `.env.local` from `.env.example` in the project root, at the same level as `package.json`:

```powershell
Copy-Item .env.example .env.local
```

Use only frontend-safe Vite variables:

```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"
VITE_WHATSAPP_NUMBER="94771234567"
```

Do not put the Supabase `service_role` key in this frontend app.

The committed `.env.example` intentionally leaves these values blank:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_WHATSAPP_NUMBER=
```

Copy it to `.env.local`, fill in the real values, then restart `npm run dev`.

Create the database tables, seed categories/products, enable RLS, and install the safe access policies by running:

```text
supabase/schema.sql
```

Run it in the Supabase Dashboard SQL Editor.

After that:

1. Go to Supabase Authentication and create an admin user.
2. Copy that user's Auth UID.
3. Insert the admin user into `admin_users`:

```sql
insert into public.admin_users (user_id, email)
values ('AUTH_USER_UUID_HERE', 'admin@pcgarage.lk');
```

Products are stored in Supabase `products`, categories in `categories`, and checkout orders in `orders`. Product images should be hosted as public URLs. The app saves only `products.image_url`, not base64 image data.

Product gallery images are saved as public image URLs in `products.gallery_image_urls`. If your database was created before gallery support was added, run this migration in the Supabase SQL Editor:

```text
supabase/migrations/20260706065749_add_product_gallery_images.sql
```

## Cloudflare Pages Deployment

Use these Cloudflare Pages settings:

```text
Build command: npm run build
Output folder: dist
```

Do not add a `public/_redirects` SPA fallback for this deployment. Cloudflare rejected `/* /index.html 200` as an infinite loop for this project.

This repo does not use `wrangler.jsonc` or Cloudflare Workers static assets. If you later move it to Workers static assets, keep `assets.directory` set to `./dist` and configure `assets.not_found_handling = "single-page-application"` there instead of using `_redirects`.

In Cloudflare Pages, add these environment variables under your project settings:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_WHATSAPP_NUMBER
```

Then redeploy the project.

To connect `pcgarage.lk`:

1. Open Cloudflare Dashboard.
2. Add `pcgarage.lk` as a Cloudflare site if it is not already there.
3. Update your domain registrar nameservers to the Cloudflare nameservers.
4. In Cloudflare Pages, open the project and go to Custom domains.
5. Add `pcgarage.lk`.
6. Add `www.pcgarage.lk` too if you want the `www` version.
7. Let Cloudflare create/verify the DNS records.
8. Wait for SSL certificate status to become active.

## Build for Deployment

Create a production build:

```bash
npm run build
```

The generated files will be available in:

```text
dist/
```

Deploy the `dist` folder to any static hosting provider that supports single-page React apps, such as Netlify, Vercel, Cloudflare Pages, or a static web server.
