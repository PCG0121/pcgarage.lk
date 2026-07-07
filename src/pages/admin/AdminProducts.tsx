import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Plus, Trash2, X, PackageCheck, Pencil, RefreshCcw } from 'lucide-react';
import type { CategoryRecord, Product } from '../../types';
import { useProductStore } from '../../store/productStore';

const fallbackImage =
  'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800';

const warrantyOptions = [
  '',
  '3 months warranty',
  '6 months warranty',
  '1 year warranty',
  '2 years warranty',
  '3 years warranty',
  '5 years warranty',
  'Lifetime limited warranty',
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseImageUrls(value: FormDataEntryValue | null) {
  return String(value || '')
    .split(/[\n,]+/)
    .map((url) => url.trim())
    .filter(Boolean);
}

function findCategoryIdByProductName(productName: string, categories: CategoryRecord[]) {
  const normalized = productName.toLowerCase();
  const categoryMatches = [
    { category: 'Laptop Batteries', keywords: ['battery', 'batteries'] },
    { category: 'Displays', keywords: ['display', 'screen', 'lcd', 'panel'] },
    { category: 'Keyboards', keywords: ['keyboard', 'keypad'] },
    { category: 'SSD', keywords: ['ssd', 'nvme', 'm.2'] },
    { category: 'RAM', keywords: ['ram', 'memory', 'ddr'] },
    { category: 'Chargers', keywords: ['charger', 'adapter', 'power supply'] },
    { category: 'Printers', keywords: ['printer', 'toner', 'ink'] },
    { category: 'Accessories', keywords: ['mouse', 'cable', 'hub', 'adapter', 'accessory'] },
  ];

  const match = categoryMatches.find(({ keywords }) =>
    keywords.some((keyword) => normalized.includes(keyword))
  );

  if (!match) return '';
  return categories.find((category) => category.name === match.category)?.id || '';
}

function getProductSaveError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Could not save product.';
  const normalized = message.toLowerCase();

  if (normalized.includes('row-level security')) {
    return 'Product save blocked by Supabase admin permissions. Check that this logged-in user is in public.admin_users.';
  }

  if (normalized.includes('gallery_image_urls')) {
    return 'Gallery images need the latest Supabase migration. Run the add_product_gallery_images migration in Supabase, then try again.';
  }

  if (normalized.includes('duplicate key') || normalized.includes('products_slug_key')) {
    return 'A product with this slug already exists. Change the slug or product name and try again.';
  }

  return message;
}

export function AdminProducts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const products = useProductStore((state) => state.products);
  const categories = useProductStore((state) => state.categories);
  const isUsingFallback = useProductStore((state) => state.isUsingFallback);
  const loadAdminProducts = useProductStore((state) => state.loadAdminProducts);
  const addProduct = useProductStore((state) => state.addProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const deleteProduct = useProductStore((state) => state.deleteProduct);

  useEffect(() => {
    loadAdminProducts();
  }, [loadAdminProducts]);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormError('');
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const selectedCategoryId = useMemo(() => {
    if (!editingProduct) return categories[0]?.id || '';
    return editingProduct.category_id || categories.find((category) => category.name === editingProduct.category)?.id || '';
  }, [categories, editingProduct]);

  useEffect(() => {
    if (isModalOpen) setCategoryId(selectedCategoryId);
  }, [isModalOpen, selectedCategoryId]);

  const handleProductNameChange = (value: string) => {
    const matchedCategoryId = findCategoryIdByProductName(value, categories);
    if (matchedCategoryId) setCategoryId(matchedCategoryId);
  };

  const handleSaveProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setFormError('');
    setIsSaving(true);

    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const categoryId = String(formData.get('category_id') || '').trim();
    const categoryName = categories.find((category) => category.id === categoryId)?.name || editingProduct?.category || 'Accessories';
    const stockQuantity = Number(formData.get('stock_quantity') || 0);
    const imageUrl = String(formData.get('image_url') || '').trim() || fallbackImage;
    const galleryImageUrls = parseImageUrls(formData.get('gallery_image_urls')).filter((url) => url !== imageUrl);
    const description = String(formData.get('description') || '').trim();

    try {
      const payload = {
        name,
        slug: String(formData.get('slug') || '').trim() || slugify(name),
        category_id: categoryId || null,
        category: categoryName,
        price: Number(formData.get('price') || 0),
        stock_quantity: stockQuantity,
        sku: String(formData.get('sku') || '').trim(),
        warranty: String(formData.get('warranty') || '').trim(),
        image_url: imageUrl,
        gallery_image_urls: galleryImageUrls,
        description: description || 'Product details will be updated soon.',
        is_active: formData.get('is_active') === 'on',
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await addProduct(payload);
      }

      form.reset();
      closeModal();
    } catch (error) {
      setFormError(getProductSaveError(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    const ok = window.confirm(`Delete ${product.name}?`);
    if (!ok) return;

    try {
      await deleteProduct(product.id);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Could not delete product.');
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Products</h1>
          <p className="mt-2 text-sm text-zinc-500 font-medium">
            Add products with image URLs, stock quantity, pricing, warranty, and product details.
          </p>
          {isUsingFallback && (
            <p className="mt-2 text-xs font-bold text-amber-600">
              Supabase is not configured yet, so demo fallback data is showing. Create .env.local in the project root to connect live products.
            </p>
          )}
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadAdminProducts}
            className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-bold text-zinc-700 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-2 transition-colors"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center rounded-xl border border-transparent bg-rose-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 sm:w-auto transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {formError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {formError}
        </div>
      )}

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow-sm border border-zinc-200 md:rounded-2xl bg-white">
              <table className="min-w-full divide-y divide-zinc-200">
                <thead className="bg-zinc-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider sm:pl-6">
                      Product
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      Qty
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white">
                  {products.map((product) => {
                    const quantity = product.stock_quantity ?? (product.in_stock ? 1 : 0);

                    return (
                      <tr key={product.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-12 w-12 flex-shrink-0 bg-zinc-100 rounded-xl p-1">
                              <img className="h-full w-full rounded-lg object-cover" src={product.image_url || fallbackImage} alt={product.name} />
                            </div>
                            <div className="ml-4 min-w-0">
                              <div className="font-bold text-zinc-900 truncate max-w-[240px]">{product.name}</div>
                              <div className="text-xs text-zinc-500 truncate max-w-[260px]">{product.description}</div>
                              {product.sku && <div className="text-[11px] text-zinc-400 mt-0.5">SKU: {product.sku}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-zinc-500">
                          {product.category}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-black text-zinc-900">
                          {quantity}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500">
                          <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${product.is_active === false ? 'bg-zinc-100 text-zinc-500' : quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                            {product.is_active === false ? 'Inactive' : quantity > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-black text-zinc-900">
                          Rs. {product.price.toLocaleString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end gap-3">
                            <button
                              className="text-zinc-400 hover:text-blue-600 transition-colors"
                              type="button"
                              onClick={() => openEditModal(product)}
                            >
                              <Pencil className="w-4 h-4" />
                              <span className="sr-only">Edit {product.name}</span>
                            </button>
                            <button
                              className="text-zinc-400 hover:text-red-600 transition-colors"
                              type="button"
                              onClick={() => handleDeleteProduct(product)}
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="sr-only">Delete {product.name}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-zinc-100">
              <div>
                <h2 className="text-lg font-black text-zinc-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <p className="text-sm text-zinc-500 mt-1">Use a public image URL. Base64 images are not stored.</p>
              </div>
              <button onClick={closeModal} className="text-zinc-400 hover:text-zinc-900" type="button">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="admin-product-form p-6 overflow-y-auto">
              <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold text-zinc-900 mb-1">Product Name</label>
                      <input name="name" defaultValue={editingProduct?.name || ''} onChange={(event) => handleProductNameChange(event.currentTarget.value)} required type="text" placeholder="Example: Samsung 980 PRO 1TB SSD" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500" />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold text-zinc-900 mb-1">Slug</label>
                      <input name="slug" defaultValue={editingProduct?.slug || ''} type="text" placeholder="Auto-generated from name if empty" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-zinc-900 mb-1">Category</label>
                      <select name="category_id" value={categoryId} onChange={(event) => setCategoryId(event.currentTarget.value)} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500">
                        {categories.length === 0 && <option value="">Accessories</option>}
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-zinc-900 mb-1">SKU / Model</label>
                      <input name="sku" defaultValue={editingProduct?.sku || ''} type="text" placeholder="Optional" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-zinc-900 mb-1">Price (Rs.)</label>
                      <input name="price" defaultValue={editingProduct?.price || ''} required type="number" min="0" step="0.01" placeholder="0" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-zinc-900 mb-1">Quantity</label>
                      <input name="stock_quantity" defaultValue={editingProduct?.stock_quantity ?? 0} required type="number" min="0" placeholder="Available stock" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500" />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold text-zinc-900 mb-1">Warranty / Note</label>
                      <select name="warranty" defaultValue={editingProduct?.warranty || ''} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500">
                        {warrantyOptions.map((option) => (
                          <option key={option || 'none'} value={option}>
                            {option || 'No warranty'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold text-zinc-900 mb-1">Product Details</label>
                      <textarea
                        name="description"
                        defaultValue={editingProduct?.description || ''}
                        rows={5}
                        required
                        placeholder="Add product specs, compatibility, condition, warranty details, and anything customers should know."
                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    </div>

                    <label className="sm:col-span-2 inline-flex items-center gap-2 text-sm font-bold text-zinc-700">
                      <input name="is_active" type="checkbox" defaultChecked={editingProduct?.is_active ?? true} className="h-4 w-4 rounded border-zinc-300 text-rose-600 focus:ring-rose-500" />
                      Active on storefront
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-zinc-900 mb-1">Product Image URL</label>
                    <input name="image_url" defaultValue={editingProduct?.image_url || ''} type="url" placeholder="https://example.com/image.jpg" className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-zinc-900 mb-1">Gallery Image URLs</label>
                    <textarea
                      name="gallery_image_urls"
                      defaultValue={editingProduct?.gallery_image_urls?.join('\n') || ''}
                      rows={5}
                      placeholder="Paste extra image URLs, one per line"
                      className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>

                  <div className="rounded-xl border border-zinc-200 bg-white p-3">
                    <div className="mb-2 flex items-center gap-2 text-sm font-bold text-zinc-900">
                      <PackageCheck className="h-4 w-4 text-rose-600" />
                      Image Policy
                    </div>
                    <div className="aspect-[4/3] overflow-hidden rounded-lg bg-zinc-100">
                      <img
                        src={editingProduct?.image_url || fallbackImage}
                        alt="Product preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="mt-2 text-xs text-zinc-500">
                      Upload images to Supabase Storage or another host, then paste the public URL here.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-zinc-100 pt-5 sm:flex-row sm:justify-end">
                <button type="button" onClick={closeModal} className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white hover:bg-rose-700 transition-colors disabled:opacity-60">
                  <Plus className="mr-2 h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>

            <style>{`
              .admin-product-form input:not([type="checkbox"]),
              .admin-product-form textarea,
              .admin-product-form select {
                background-color: #ffffff;
                color: #18181b;
              }

              .admin-product-form input::placeholder,
              .admin-product-form textarea::placeholder {
                color: #a1a1aa;
                opacity: 1;
              }

              .admin-product-form select option {
                background-color: #ffffff;
                color: #18181b;
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
}
