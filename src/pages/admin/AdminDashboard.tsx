import { Users, DollarSign, Package, ShoppingCart } from 'lucide-react';
import { useProductStore } from '../../store/productStore';

export function AdminDashboard() {
  const productCount = useProductStore((state) => state.products.length);

  const stats = [
    { name: 'Total Revenue', value: 'Rs. 450,000', icon: DollarSign, trend: '+12%' },
    { name: 'Orders', value: '34', icon: ShoppingCart, trend: '+5%' },
    { name: 'Products', value: String(productCount), icon: Package, trend: 'Live' },
    { name: 'Customers', value: '89', icon: Users, trend: '+18%' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black text-zinc-900 mb-8 uppercase tracking-tight">Dashboard Overview</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow-sm rounded-2xl overflow-hidden border border-zinc-200">
              <dt>
                <div className="absolute bg-zinc-50 rounded-xl p-3 border border-zinc-100">
                  <Icon className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <p className="ml-16 text-sm font-bold text-zinc-500 truncate">{item.name}</p>
              </dt>
              <dd className="ml-16 pb-6 flex items-baseline sm:pb-7 mt-1">
                <p className="text-2xl font-black text-zinc-900">{item.value}</p>
                <p className="ml-2 flex items-baseline text-xs font-bold text-[#25D366]">
                  {item.trend}
                </p>
              </dd>
            </div>
          );
        })}
      </div>

      <div className="bg-white shadow-sm rounded-2xl border border-zinc-200 p-6 md:p-8">
         <h2 className="text-lg font-black text-zinc-900 mb-4 uppercase tracking-tight">Recent Activity</h2>
         <p className="text-zinc-500 text-sm font-medium">Dashboard metrics will populate when Supabase integration is fully connected.</p>
      </div>
    </div>
  );
}
