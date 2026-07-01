import { useEffect, useState } from 'react';
import type { Order } from '../../types';
import { supabase, supabaseSetupMessage } from '../../lib/supabase';

const orderStatuses = ['pending', 'processing', 'completed', 'cancelled'] as const;

function getStatusClass(status: string) {
  if (status === 'completed') return 'bg-[#25D366]/10 text-[#25D366]';
  if (status === 'processing') return 'bg-blue-100 text-blue-800';
  if (status === 'cancelled') return 'bg-red-100 text-red-700';
  return 'bg-yellow-100 text-yellow-800';
}

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      if (!supabase) {
        setIsLoading(false);
        setError(supabaseSetupMessage || 'Supabase is not configured yet.');
        return;
      }

      const { data, error: orderError } = await supabase
        .from('orders')
        .select('id,customer_name,phone,address,city,items,total,status,created_at')
        .order('created_at', { ascending: false });

      if (orderError) {
        setError(orderError.message);
      } else {
        setOrders((data as Order[] | null) || []);
      }
      setIsLoading(false);
    };

    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    if (!supabase) return;

    setError('');
    const previousOrders = orders;
    setOrders((currentOrders) =>
      currentOrders.map((order) => (order.id === orderId ? { ...order, status } : order))
    );

    const { error: updateError } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (updateError) {
      setOrders(previousOrders);
      setError(updateError.message);
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tight">Orders</h1>
          <p className="mt-2 text-sm text-zinc-500 font-medium">
            Manage your store orders from Supabase.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
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
                      Order ID
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white">
                  {isLoading && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-sm font-bold text-zinc-500">
                        Loading orders...
                      </td>
                    </tr>
                  )}

                  {!isLoading && orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-sm font-bold text-zinc-500">
                        No orders yet.
                      </td>
                    </tr>
                  )}

                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-bold text-zinc-900 sm:pl-6">
                        {order.id.slice(0, 8)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-zinc-500">
                        <div className="font-bold text-zinc-900">{order.customer_name}</div>
                        <div className="text-xs text-zinc-500">{order.phone}</div>
                        <div className="text-xs text-zinc-400">{[order.address, order.city].filter(Boolean).join(', ')}</div>
                      </td>
                      <td className="px-3 py-4 text-sm font-medium text-zinc-500">
                        <div className="max-w-xs truncate">
                          {order.items.map((item) => `${item.quantity}x ${item.name}`).join(', ')}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-zinc-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-black text-zinc-900">
                        Rs. {Number(order.total).toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <select
                          value={order.status}
                          onChange={(event) => handleStatusChange(order.id, event.target.value)}
                          className={`rounded-md border border-transparent px-2 py-1 text-[10px] font-bold uppercase tracking-wider outline-none ${getStatusClass(order.status)}`}
                        >
                          {orderStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
