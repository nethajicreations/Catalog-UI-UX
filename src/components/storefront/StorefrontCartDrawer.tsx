import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useStore } from '../../context/StoreContext';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Tag,
  CreditCard,
  Truck,
  MessageSquare,
  IndianRupee,
  QrCode,
} from 'lucide-react';
import { Order } from '../../types';

interface StorefrontCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StorefrontCartDrawer: React.FC<StorefrontCartDrawerProps> = ({ isOpen, onClose }) => {
  const { navigate } = useRouter();
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    currentTenant,
    createOrderFromCart,
    b2bModeActive,
    addToast,
  } = useStore();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'success'>('cart');
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);

  // Checkout inputs
  const [customerName, setCustomerName] = useState('Rahul Verma');
  const [customerPhone, setCustomerPhone] = useState('+91 98200 45678');
  const [customerEmail, setCustomerEmail] = useState('rahul.verma@example.com');
  const [shippingAddress, setShippingAddress] = useState('Flat 402, Sunshine Heights, Andheri West');
  const [city, setCity] = useState('Mumbai');
  const [pincode, setPincode] = useState('400053');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod' | 'card'>('upi');
  const [companyGstin, setCompanyGstin] = useState('');

  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  // Subtotal calculations
  const subtotal = cart.reduce((sum, item) => {
    const unitPrice = b2bModeActive && item.product.wholesalePrice
      ? item.product.wholesalePrice
      : item.product.salePrice || item.product.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const freeShippingGoal = 999;
  const remainingForFreeShipping = Math.max(0, freeShippingGoal - subtotal);
  const shippingFee = subtotal >= freeShippingGoal || subtotal === 0 ? 0 : 60;
  const discountAmount = appliedDiscount ? Math.round((subtotal * appliedDiscount.percent) / 100) : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = discountCode.trim().toUpperCase();
    if (code === 'FESTIVE10' || code === 'SAVE10') {
      setAppliedDiscount({ code, percent: 10 });
      addToast('10% Festive Discount applied!', 'success');
    } else if (code === 'B2B5' && b2bModeActive) {
      setAppliedDiscount({ code, percent: 5 });
      addToast('5% Extra B2B Wholesale Discount applied!', 'success');
    } else {
      addToast('Invalid coupon code. Try FESTIVE10', 'error');
    }
  };

  const handleCompleteOrder = () => {
    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      addToast('Please fill in required delivery information', 'error');
      return;
    }

    const newOrder = createOrderFromCart({
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress: `${shippingAddress}, ${city} - ${pincode}`,
      paymentMethod: paymentMethod === 'upi' ? 'UPI (Instant QR)' : paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit / Debit Card',
      discountCode: appliedDiscount?.code,
      discountAmount,
      shippingFee,
    });

    setCompletedOrder(newOrder);
    setCheckoutStep('success');
  };

  const handleWhatsAppOrderShare = () => {
    const itemsList = cart
      .map((item) => `• ${item.quantity}x ${item.product.name} (₹${item.product.salePrice || item.product.price})`)
      .join('\n');

    const msg = encodeURIComponent(
      `Hello ${currentTenant.name}! I would like to place an order:\n\n${itemsList}\n\n*Total Amount:* ₹${grandTotal}\n*Delivery to:* ${customerName}, ${shippingAddress}, ${city} - ${pincode}\n*Contact:* ${customerPhone}\n\nPlease confirm availability and payment details!`
    );

    window.open(`https://wa.me/${currentTenant.supportPhone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Top Header */}
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neutral-900" />
              <h2 className="text-base font-bold text-neutral-900">
                {checkoutStep === 'cart' ? 'Shopping Bag' : checkoutStep === 'shipping' ? 'Checkout' : 'Order Placed!'}
              </h2>
              {checkoutStep === 'cart' && (
                <span className="text-xs bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full font-semibold">
                  {cart.length} item{cart.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {checkoutStep === 'cart' && (
              <>
                {/* Free Shipping Progress Indicator */}
                <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200 text-xs">
                  {remainingForFreeShipping > 0 ? (
                    <div>
                      <span className="text-neutral-700 font-medium">
                        Add <strong className="text-neutral-900">₹{remainingForFreeShipping}</strong> more for <strong>FREE Delivery</strong>!
                      </span>
                      <div className="w-full h-1.5 bg-neutral-200 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${Math.min(100, Math.round((subtotal / freeShippingGoal) * 100))}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Congratulations! Your order qualifies for FREE Pan-India Delivery.</span>
                    </div>
                  )}
                </div>

                {/* Cart Items */}
                {cart.length === 0 ? (
                  <div className="py-16 text-center">
                    <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-neutral-800">Your bag is empty</p>
                    <p className="text-xs text-neutral-500 mt-1">Explore our catalog and find something great.</p>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold"
                    >
                      Browse Catalogue
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100">
                    {cart.map((item) => {
                      const unitPrice = b2bModeActive && item.product.wholesalePrice
                        ? item.product.wholesalePrice
                        : item.product.salePrice || item.product.price;

                      return (
                        <div key={item.product.id + (item.variant || '')} className="py-3.5 flex gap-3">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-16 h-16 rounded-lg object-cover border border-neutral-200 shrink-0"
                          />

                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-neutral-900 truncate">{item.product.name}</h4>
                            <div className="text-xs font-bold text-neutral-900 mt-0.5">
                              ₹{unitPrice.toLocaleString('en-IN')}
                              {b2bModeActive && item.product.wholesalePrice && (
                                <span className="text-[10px] text-indigo-600 font-semibold ml-1.5">(B2B Rate)</span>
                              )}
                            </div>

                            {/* Quantity buttons */}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center border border-neutral-200 rounded-md bg-neutral-50">
                                <button
                                  type="button"
                                  onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.variant)}
                                  className="p-1 text-neutral-600 hover:text-neutral-900"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="px-2.5 text-xs font-bold text-neutral-900">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.variant)}
                                  className="p-1 text-neutral-600 hover:text-neutral-900"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeFromCart(item.product.id, item.variant)}
                                className="text-neutral-400 hover:text-rose-600 p-1"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Coupon Code Section */}
                {cart.length > 0 && (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2 pt-2 border-t border-neutral-100">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="Discount code (e.g. FESTIVE10)"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-lg pl-8 pr-2.5 py-1.5 text-xs font-mono uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-semibold"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </>
            )}

            {/* Step 2: Shipping & Payment */}
            {checkoutStep === 'shipping' && (
              <div className="space-y-4 text-xs">
                <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200 space-y-3">
                  <h3 className="font-bold text-neutral-900">Delivery Details</h3>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">Mobile Number *</label>
                      <input
                        type="text"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Shipping Address *</label>
                    <textarea
                      rows={2}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded-lg p-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">Pincode</label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="space-y-2">
                  <h3 className="font-bold text-neutral-900">Choose Payment Method</h3>

                  {/* UPI */}
                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer ${
                      paymentMethod === 'upi' ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payMethod"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="mt-0.5 text-neutral-900"
                    />
                    <div>
                      <span className="font-bold text-neutral-900 block">Instant UPI Payment (GPay, PhonePe, Paytm)</span>
                      <span className="text-[11px] text-neutral-500">Scan QR Code or direct UPI Intent with 0% gateway fees</span>
                      {paymentMethod === 'upi' && (
                        <div className="mt-2 p-2.5 bg-white rounded-lg border border-neutral-200 flex items-center gap-3">
                          <div className="w-14 h-14 bg-neutral-900 text-white rounded flex items-center justify-center font-mono text-[9px] text-center p-1">
                            UPI QR SIMULATOR
                          </div>
                          <div>
                            <span className="font-bold text-neutral-900">Scan to pay: ₹{grandTotal}</span>
                            <p className="font-mono text-[10px] text-neutral-500">UPI ID: dailyneeddeals@okaxis</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Cash On Delivery */}
                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer ${
                      paymentMethod === 'cod' ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-neutral-900"
                    />
                    <div>
                      <span className="font-bold text-neutral-900 block">Cash on Delivery (COD)</span>
                      <span className="text-[11px] text-neutral-500">Pay cash upon delivery at your doorstep</span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Step 3: Success Confirmation */}
            {checkoutStep === 'success' && completedOrder && (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-neutral-900">Order Confirmed!</h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Thank you, <strong>{completedOrder.customerName}</strong>! Your order{' '}
                  <strong className="text-neutral-900 font-mono">{completedOrder.orderNumber}</strong> has been received and is being prepared for dispatch.
                </p>

                <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200 text-xs text-left space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Order Total:</span>
                    <span className="font-bold text-neutral-900">₹{completedOrder.total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Payment Method:</span>
                    <span className="font-semibold text-neutral-800">{completedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Delivery Address:</span>
                    <span className="font-medium text-neutral-800 truncate max-w-[200px]">
                      {completedOrder.shippingAddress}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2.5 bg-neutral-900 text-white font-semibold rounded-xl text-xs"
                  >
                    Continue Shopping
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate(`/dashboard/orders`);
                    }}
                    className="w-full py-2 border border-neutral-200 text-neutral-700 hover:bg-neutral-50 font-semibold rounded-xl text-xs"
                  >
                    View in Merchant Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Summary & Proceed Button */}
          {cart.length > 0 && checkoutStep !== 'success' && (
            <div className="p-4 border-t border-neutral-200 bg-neutral-50/70 space-y-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({appliedDiscount?.code})</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-500">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-neutral-900 pt-1 border-t border-neutral-200">
                  <span>Total Amount</span>
                  <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {checkoutStep === 'cart' ? (
                <div className="space-y-2">
                  <button
                    id="cart-checkout-proceed-btn"
                    type="button"
                    onClick={() => setCheckoutStep('shipping')}
                    className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppOrderShare}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Quick Order on WhatsApp</span>
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="px-3 py-2 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700"
                  >
                    Back
                  </button>
                  <button
                    id="cart-place-order-btn"
                    type="button"
                    onClick={handleCompleteOrder}
                    className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-bold text-xs shadow-xs"
                  >
                    Confirm & Place Order (₹{grandTotal})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
