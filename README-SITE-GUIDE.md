# PC Garage Sri Lanka - Site Guide

Me guide eka PC Garage Sri Lanka site eka run karana vidiha, site eka weda karana vidiha, admin login eka, products add karana vidiha saha WhatsApp order flow eka explain karanna hadapu simple README ekak.

## 1. Project Eka Mokakda?

Me project eka React + Vite ecommerce storefront ekak. Customers lata PC parts browse karanna, cart ekata add karanna, checkout page eken details daala WhatsApp order ekak yawanna puluwan.

Main features:

- Home page
- Categories page
- Products listing page
- Product details page
- Cart
- Checkout with WhatsApp redirect
- Demo admin dashboard
- Admin products add/delete
- Demo orders page

## 2. Tech Stack

- React
- TypeScript
- Vite
- React Router
- Zustand state management
- Tailwind CSS utilities
- Supabase client setup
- WhatsApp order link

## 3. Project Eka Run Karana Vidiha

First time run karanawanam dependencies install karanna:

```bash
npm install
```

Development server eka start karanna:

```bash
npm run dev
```

Browser eken open karanna:

```text
http://127.0.0.1:5173
```

Production build eka hadanna:

```bash
npm run build
```

Build output eka `dist` folder ekata yanawa.

## 4. Environment File Setup

`.env.example` file eka copy karala `.env.local` hadanna.

PowerShell:

```powershell
Copy-Item .env.example .env.local
```

`.env.local` file eke me values update karanna:

```env
VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
VITE_WHATSAPP_NUMBER="94771234567"
```

Important:

- `VITE_WHATSAPP_NUMBER` eka country code ekath ekka denna.
- `+`, spaces, dashes danna epa.
- Example: `94771234567`

Danata products/orders demo data walin weda karanawa. Supabase values empty unath site eka preview karanna puluwan.

## 5. Site Eka Weda Karana Vidiha

### Customer Flow

1. Customer home page or products page ekata yanawa.
2. Product ekak select karala details balanna puluwan.
3. `Add to Cart` click karama product eka cart ekata yanawa.
4. Cart page eken quantity update karanna puluwan.
5. Checkout page eken customer name, phone, address, city fill karanawa.
6. Order details WhatsApp message ekakata convert wenawa.
7. Customer WhatsApp ekata redirect wenawa.

### WhatsApp Order Flow

Checkout page eke form submit karama app eka me wage message ekak hadanawa:

```text
New Order - PC Garage

Customer:
Name: ...
Phone: ...
Address: ...

Items:
1x Product Name - Rs. ...

Total: Rs. ...
```

Then browser eka me link ekata yanawa:

```text
https://wa.me/YOUR_NUMBER?text=ORDER_MESSAGE
```

WhatsApp number eka `.env.local` file eke `VITE_WHATSAPP_NUMBER` walin control wenawa.

## 6. Admin Login

Admin panel ekata yanna:

```text
http://127.0.0.1:5173/admin
```

Demo login:

```text
Email: admin@pcgarage.lk
Password: admin123
```

Login una passe me pages access karanna puluwan:

- `/admin/dashboard`
- `/admin/products`
- `/admin/orders`

Note: Me admin login eka demo login ekak. Real production use karanawanam backend authentication/Supabase auth connect karanna ona.

## 7. Product Add Karana Vidiha - Admin Panel

Admin panel eken product add karanna:

1. Browser eken `/admin` open karanna.
2. Demo credentials walin login wenna.
3. Sidebar/menu eken `Products` page ekata yanna.
4. `Add Product` button eka click karanna.
5. Product details fill karanna:
   - Product Name
   - Category
   - SKU / Model
   - Price
   - Quantity
   - Warranty / Note
   - Product Details
   - Product Image URL or Upload Image
6. `Save Product` click karanna.
7. Product eka admin products table ekata add wenawa.
8. Public products page eketh product eka pennanawa.

Important:

- Quantity `0` nam product eka `Out of Stock`.
- Quantity `1` or more nam product eka `In Stock`.
- Uploaded image ekak select karala thiyenawanam image URL ekata wada upload image eka use wenawa.
- Image URL ekakuth upload image ekakuth nathnam fallback demo image ekak use wenawa.

## 8. Product Delete Karana Vidiha

Admin products table eke product row eka right side eke delete icon eka click karanna. E product eka browser local storage eken remove wenawa.

## 9. Demo Products Reset Karana Vidiha

Admin products page eke `Reset Demo` button eka click karama default demo products tika aye load wenawa.

Default products source file eka:

```text
src/data/mock.ts
```

## 10. Products Save Wenne Kohomada?

Danata product data save wenne browser local storage eke.

Product store file eka:

```text
src/store/productStore.ts
```

Storage key eka:

```text
pc-garage-products
```

Meaning:

- Same browser eke add karapu products pennanawa.
- Browser data clear kaloth added products nathi wenna puluwan.
- Real live site ekakata backend database/Supabase connect karanna ona.

## 11. Default Product List Eka Permanently Edit Karana Vidiha

Default products tika code eken edit karanna ona nam me file eka open karanna:

```text
src/data/mock.ts
```

Product object example:

```ts
{
  id: '7',
  name: 'Lenovo 65W USB-C Charger',
  description: 'Original replacement charger for Lenovo USB-C laptops.',
  price: 9500,
  category: 'Chargers',
  image_url: 'https://example.com/charger.jpg',
  in_stock: true,
  stock_quantity: 5,
  sku: 'LEN-65W-USBC',
  warranty: '6 months warranty',
  created_at: new Date().toISOString(),
}
```

Category eka me list eken ekak wenna ona:

```text
Laptop Batteries
Keyboards
Displays
SSD
RAM
Chargers
Printers
Accessories
```

## 12. Main Files

```text
src/App.tsx
```

Routes define karana file eka.

```text
src/pages/ProductList.tsx
```

Products listing page eka.

```text
src/pages/ProductDetail.tsx
```

Single product details page eka.

```text
src/pages/Cart.tsx
```

Shopping cart page eka.

```text
src/pages/Checkout.tsx
```

Checkout saha WhatsApp redirect logic eka.

```text
src/pages/admin/AdminLogin.tsx
```

Admin login page eka.

```text
src/pages/admin/AdminProducts.tsx
```

Admin product add/delete UI eka.

```text
src/store/productStore.ts
```

Products local storage state eka.

```text
src/store/cartStore.ts
```

Cart local storage state eka.

```text
src/data/mock.ts
```

Default demo products and categories.

## 13. Deploy Karana Vidiha

Production build eka hadanna:

```bash
npm run build
```

Then `dist` folder eka hosting provider ekakata upload/deploy karanna.

Suitable hosting:

- Vercel
- Netlify
- Cloudflare Pages
- Any static hosting server

SPA routing support enable karanna ona. Nathnam `/products`, `/admin` wage routes refresh karama 404 enna puluwan.

## 14. Production Walata Before Going Live

Live site ekakata yanna kalin me tika karanna:

- Real WhatsApp number eka `.env.local` walata daanna.
- Demo admin credentials remove/change karanna.
- Supabase or backend database connect karanna.
- Products local storage walata witharak depend wenna epa.
- Admin auth real authentication ekakata maru karanna.
- Product images reliable hosting location ekakata upload karanna.
- Build eka test karanna:

```bash
npm run build
npm run preview
```

## 15. Quick Summary

- Public site eka customers lata products balanna, cart use karanna, WhatsApp order yawanna.
- Admin panel eka `/admin` route eken access karanna.
- Products add/delete karanna `/admin/products`.
- Demo products browser local storage eke save wenawa.
- Default products code eken edit karanna `src/data/mock.ts`.
- WhatsApp number eka `.env.local` file eke `VITE_WHATSAPP_NUMBER`.
