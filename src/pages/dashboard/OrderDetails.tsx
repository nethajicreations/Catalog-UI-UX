import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useStore } from '../../context/StoreContext';
import { StatusBadge } from '../../components/ui/Badge';
import {
  ArrowLeft,
  Printer,
  MessageSquare,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  Phone,
  Mail,
  IndianRupee,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Order } from '../../types';

export const OrderDetails: React.FC = () => {
  const { navigate, params } = useRouter();
  const { orders, updateOrderStatus, currentTenant, addToast } = useStore();

  const order = orders.find((o) => o.id === params.orderId);
  const [trackingNumber, setTrackingNumber] = useState(order?.shippingTrackingNumber || '');
  const [notes, setNotes] = useState(order?.notes || '');
  const [invoiceModal, setInvoiceModal] = useState(false);

  if (!order) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center max-w-lg mx-auto">
        <Package className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
        <h2 className="text-base font-bold text-neutral-900">Order Not Found</h2>
        <button
          type="button"
          onClick={() => navigate('/dashboard/orders')}
          className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const fulfillmentSteps = [
    { key: 'pending', label: 'Order Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const currentStepIndex = fulfillmentSteps.findIndex((s) => s.key === order.fulfillmentStatus);

  const handleStatusChange = (newStatus: Order['fulfillmentStatus']) => {
    updateOrderStatus(order.id, newStatus);
  };

  const handleSaveTracking = () => {
    addToast(`Tracking number updated to ${trackingNumber}`, 'success');
  };

  const handleWhatsAppUpdate = () => {
    const text = encodeURIComponent(
      `Hello ${order.customerName}, your order *${order.orderNumber}* is now *${order.fulfillmentStatus.toUpperCase()}*! Tracking: ${trackingNumber || 'Available shortly'}. Total: ₹${order.total}. Thank you for shopping with ${currentTenant.name}.`
    );
    window.open(`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/orders')}
            className="p-2 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Order {order.orderNumber}</h1>
              <StatusBadge status={order.fulfillmentStatus} />
              <StatusBadge status={order.paymentStatus} />
            </div>
            <p className="text-xs text-neutral-500">
              Placed on {order.date} · via {order.paymentMethod}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setInvoiceModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-50 rounded-lg text-xs font-semibold shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-neutral-600" />
            <span>Print Invoice</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsAppUpdate}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Update</span>
          </button>
        </div>
      </div>

      {/* Fulfillment Progress Stepper */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Fulfillment Status</h2>
          <select
            value={order.fulfillmentStatus}
            onChange={(e) => handleStatusChange(e.target.value as any)}
            className="bg-neutral-100 border border-neutral-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-neutral-800 focus:outline-none"
          >
            <option value="pending">Mark as Pending</option>
            <option value="confirmed">Mark as Confirmed</option>
            <option value="processing">Mark as Processing</option>
            <option value="shipped">Mark as Shipped</option>
            <option value="delivered">Mark as Delivered</option>
            <option value="cancelled">Mark as Cancelled</option>
          </select>
        </div>

        <div className="grid grid-cols-5 gap-2 text-center relative">
          {fulfillmentSteps.map((step, idx) => {
            const isCompleted = idx <= (currentStepIndex === -1 ? 0 : currentStepIndex);
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={step.key} className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                  } ${isCurrent ? 'ring-2 ring-neutral-900 ring-offset-2' : ''}`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span className={`text-[11px] mt-1.5 font-medium ${isCompleted ? 'text-neutral-900' : 'text-neutral-400'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Ordered Items & Financials */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items Table */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-neutral-100">
              <h2 className="text-sm font-bold text-neutral-900">Ordered Items ({order.items.length})</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-100">
                  <tr>
                    <th className="px-4 py-2.5">Item</th>
                    <th className="px-4 py-2.5">Price</th>
                    <th className="px-4 py-2.5">Qty</th>
                    <th className="px-4 py-2.5 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-neutral-900">{item.name}</div>
                        {item.selectedVariant && (
                          <div className="text-[11px] text-neutral-400">Variant: {item.selectedVariant}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">₹{item.price.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 font-semibold">{item.quantity}</td>
                      <td className="px-4 py-3 text-right font-bold text-neutral-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Breakdown */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-100 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping Fees</span>
                <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Estimated Tax / GST</span>
                <span>₹{order.tax.toLocaleString('en-IN')}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount Applied ({order.discountCode || 'PROMO'})</span>
                  <span>-₹{order.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                <span>Grand Total</span>
                <span>₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Logistics Tracking */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-neutral-500" />
              <span>Courier & Dispatch Tracking</span>
            </h2>

            <div className="flex gap-2">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="AWB Tracking Number (e.g. DELHIVERY-84920492)"
                className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 text-xs text-neutral-900 font-mono focus:bg-white"
              />
              <button
                type="button"
                onClick={handleSaveTracking}
                className="px-3.5 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold"
              >
                Save AWB
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Customer Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-neutral-900">Customer Details</h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center shrink-0">
                  {order.customerName[0]}
                </div>
                <div>
                  <div className="font-bold text-neutral-900">{order.customerName}</div>
                  <span className="text-[10px] text-neutral-400">Regular Customer</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-neutral-700 pt-1">
                <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <a href={`tel:${order.customerPhone}`} className="hover:underline">
                  {order.customerPhone}
                </a>
              </div>

              <div className="flex items-center gap-2 text-neutral-700">
                <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <a href={`mailto:${order.customerEmail}`} className="hover:underline">
                  {order.customerEmail}
                </a>
              </div>

              <div className="flex items-start gap-2 text-neutral-700 pt-2 border-t border-neutral-100">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-neutral-900">Delivery Address:</div>
                  <p className="text-neutral-600 leading-relaxed mt-0.5">{order.shippingAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-3 text-xs">
            <h2 className="text-sm font-bold text-neutral-900">Payment Info</h2>
            <div className="flex justify-between">
              <span className="text-neutral-500">Method:</span>
              <span className="font-bold text-neutral-900">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Status:</span>
              <StatusBadge status={order.paymentStatus} />
            </div>
          </div>
        </div>
      </div>

      {/* Printable Invoice Modal */}
      {invoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
            {/* Invoice Header */}
            <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">{currentTenant.name}</h2>
                <p className="text-xs text-neutral-500">Tax Invoice / Bill of Supply</p>
              </div>
              <div className="text-right text-xs">
                <div className="font-bold font-mono text-neutral-900">{order.orderNumber}</div>
                <div className="text-neutral-500">Date: {order.date}</div>
              </div>
            </div>

            {/* Billing details */}
            <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-neutral-200">
              <div>
                <span className="text-neutral-400 font-semibold block uppercase tracking-wider text-[10px]">Billed To:</span>
                <p className="font-bold text-neutral-900 mt-0.5">{order.customerName}</p>
                <p className="text-neutral-600">{order.customerPhone}</p>
                <p className="text-neutral-600">{order.shippingAddress}</p>
              </div>
              <div>
                <span className="text-neutral-400 font-semibold block uppercase tracking-wider text-[10px]">Merchant:</span>
                <p className="font-bold text-neutral-900 mt-0.5">{currentTenant.name}</p>
                <p className="text-neutral-600">support@{currentTenant.slug}.in</p>
                <p className="text-neutral-600">GSTIN: 27AABCT8492Q1Z9</p>
              </div>
            </div>

            {/* Line items */}
            <div className="py-4">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-neutral-200 font-semibold text-neutral-600">
                  <tr>
                    <th className="pb-2">Description</th>
                    <th className="pb-2">Qty</th>
                    <th className="pb-2">Rate</th>
                    <th className="pb-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {order.items.map((it, i) => (
                    <tr key={i}>
                      <td className="py-2">{it.name}</td>
                      <td className="py-2">{it.quantity}</td>
                      <td className="py-2">₹{it.price.toLocaleString('en-IN')}</td>
                      <td className="py-2 text-right font-semibold">
                        ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 pt-4 border-t border-neutral-200 space-y-1 text-xs text-right">
                <p>Subtotal: ₹{order.subtotal.toLocaleString('en-IN')}</p>
                <p>GST: ₹{order.tax.toLocaleString('en-IN')}</p>
                <p className="text-sm font-bold text-neutral-900">Total: ₹{order.total.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setInvoiceModal(false)}
                className="px-3 py-1.5 border border-neutral-200 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                  setInvoiceModal(false);
                }}
                className="px-4 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
