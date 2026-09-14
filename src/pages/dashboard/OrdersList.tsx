import React, { useState, useMemo } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useStore } from '../../context/StoreContext';
import { StatusBadge } from '../../components/ui/Badge';
import {
  ShoppingBag,
  Search,
  Filter,
  Download,
  Printer,
  MessageSquare,
  Eye,
  CheckCircle,
  Truck,
  IndianRupee,
  Clock,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { Order } from '../../types';

export const OrdersList: React.FC = () => {
  const { navigate } = useRouter();
  const { orders, updateOrderStatus, currentTenant, addToast } = useStore();

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        order.customerName.toLowerCase().includes(search.toLowerCase()) ||
        order.customerPhone.includes(search);

      const matchesTab =
        activeTab === 'all' ||
        order.fulfillmentStatus === activeTab ||
        order.paymentStatus === activeTab;

      const matchesPayment =
        paymentFilter === 'all' || order.paymentStatus === paymentFilter;

      return matchesSearch && matchesTab && matchesPayment;
    });
  }, [orders, search, activeTab, paymentFilter]);

  const handleExportCSV = () => {
    const csvContent = [
      ['Order#', 'Customer', 'Phone', 'Items', 'Total', 'PaymentStatus', 'FulfillmentStatus', 'Date'].join(','),
      ...filteredOrders.map((o) =>
        [
          o.orderNumber,
          `"${o.customerName}"`,
          o.customerPhone,
          o.items.length,
          o.total,
          o.paymentStatus,
          o.fulfillmentStatus,
          o.date,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${currentTenant.slug}-orders.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Orders exported to CSV', 'success');
  };

  const handleWhatsAppCustomer = (order: Order) => {
    const message = encodeURIComponent(
      `Hello ${order.customerName}, this is ${currentTenant.name}. Regarding your order ${order.orderNumber} (₹${order.total}). Current status: ${order.fulfillmentStatus.toUpperCase()}. Thank you for shopping with us!`
    );
    window.open(`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Orders & Dispatch</h1>
          <p className="text-xs text-neutral-500">
            {orders.length} total customer orders · Manage fulfillment, shipping labels, and invoices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="orders-export-csv-btn"
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 rounded-lg text-xs font-semibold shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 flex gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Orders', count: orders.length },
          { id: 'pending', label: 'Pending', count: orders.filter((o) => o.fulfillmentStatus === 'pending').length },
          { id: 'confirmed', label: 'Confirmed', count: orders.filter((o) => o.fulfillmentStatus === 'confirmed').length },
          { id: 'processing', label: 'Processing', count: orders.filter((o) => o.fulfillmentStatus === 'processing').length },
          { id: 'shipped', label: 'Shipped', count: orders.filter((o) => o.fulfillmentStatus === 'shipped').length },
          { id: 'delivered', label: 'Delivered', count: orders.filter((o) => o.fulfillmentStatus === 'delivered').length },
        ].map((tab) => (
          <button
            key={tab.id}
            id={`orders-tab-${tab.id}`}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 border-b-2 font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'border-neutral-900 text-neutral-900 font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <span>{tab.label}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-100 text-neutral-600 font-bold">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-neutral-200 p-3.5 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            id="orders-search-input"
            type="text"
            placeholder="Search by Order ID, customer name, mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            id="orders-payment-filter"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <option value="all">All Payment Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Payment Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-neutral-800">No orders match filter</p>
            <p className="text-xs text-neutral-500 mt-0.5">Try resetting search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-100">
                <tr>
                  <th className="px-4 py-3">Order Number</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Items Summary</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Fulfillment</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                        className="font-bold text-neutral-900 hover:text-indigo-600 font-mono text-left"
                      >
                        {order.orderNumber}
                      </button>
                      <div className="text-[10px] text-neutral-400">{order.paymentMethod}</div>
                    </td>

                    <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{order.date}</td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-neutral-900">{order.customerName}</div>
                      <div className="text-[11px] text-neutral-400">{order.customerPhone}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="text-neutral-900 font-medium">
                        {order.items[0]?.name}
                        {order.items.length > 1 && (
                          <span className="text-neutral-500 text-[11px] ml-1">
                            +{order.items.length - 1} more
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        Qty: {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={order.paymentStatus} />
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={order.fulfillmentStatus} />
                    </td>

                    <td className="px-4 py-3 font-bold text-neutral-900">
                      ₹{order.total.toLocaleString('en-IN')}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleWhatsAppCustomer(order)}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                          title="WhatsApp Update"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                          className="p-1.5 rounded-lg text-neutral-600 hover:bg-neutral-100"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
