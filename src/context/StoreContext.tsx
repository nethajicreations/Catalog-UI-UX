import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TenantStore,
  Product,
  Category,
  Catalogue,
  Order,
  Customer,
  StockMovement,
  Coupon,
  Banner,
  WhatsAppTemplate,
  LiveVisitor,
  Transaction,
  TeamMember,
  CartItem,
} from '../types';
import {
  TENANT_STORES,
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_CATALOGUES,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_COUPONS,
  INITIAL_BANNERS,
  INITIAL_WHATSAPP_TEMPLATES,
  INITIAL_LIVE_VISITORS,
  INITIAL_TRANSACTIONS,
  INITIAL_TEAM,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface StoreContextType {
  // Current Tenant
  currentTenant: TenantStore;
  availableTenants: TenantStore[];
  tenants: TenantStore[];
  switchTenant: (tenantId: string) => void;
  updateTenantSettings: (updated: Partial<TenantStore>) => void;
  updateTenant: (id: string, updated: Partial<TenantStore>) => void;
  createTenant: (nameOrData: string | Partial<TenantStore>, slug?: string) => TenantStore;
  b2bModeActive: boolean;
  setB2bModeActive: (active: boolean) => void;

  // Products
  products: Product[];
  addProduct: (newProduct: Omit<Product, 'id' | 'tenantId' | 'updatedAt'>) => Product;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStatus: (id: string) => void;

  // Categories
  categories: Category[];
  addCategory: (newCategory: Omit<Category, 'id' | 'tenantId'>) => Category;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Catalogues
  catalogues: Catalogue[];
  addCatalogue: (newCat: Omit<Catalogue, 'id' | 'tenantId' | 'lastUpdated'>) => Catalogue;
  updateCatalogue: (id: string, cat: Partial<Catalogue>) => void;
  duplicateCatalogue: (id: string) => void;
  deleteCatalogue: (id: string) => void;

  // Orders
  orders: Order[];
  updateOrderStatus: (orderId: string, status: Order['fulfillmentStatus']) => void;
  updatePaymentStatus: (orderId: string, status: Order['paymentStatus']) => void;
  createOrderFromCart: (orderDetails: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: Order['shippingAddress'];
    paymentMethod: Order['paymentMethod'];
  }) => Order;

  // Customers
  customers: Customer[];
  addCustomerNote: (customerId: string, note: string) => void;

  // Inventory & Stock Movements
  stockMovements: StockMovement[];
  adjustStock: (productId: string, quantityChange: number, reason: string, warehouse: string) => void;

  // Marketing & Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id' | 'tenantId' | 'usedCount'>) => void;
  toggleCouponStatus: (id: string) => void;

  // Banners
  banners: Banner[];
  toggleBannerStatus: (id: string) => void;

  // WhatsApp
  whatsappTemplates: WhatsAppTemplate[];
  sendWhatsAppBroadcast: (templateId: string, count?: number) => void;

  // Live Visitors
  liveVisitors: LiveVisitor[];

  // Transactions
  transactions: Transaction[];

  // Team
  teamMembers: TeamMember[];
  inviteTeamMember: (name: string, email: string, role: TeamMember['role']) => void;
  removeTeamMember: (id: string) => void;

  // Cart & Wishlist
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Toast
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenants, setTenants] = useState<TenantStore[]>(TENANT_STORES);
  const [currentTenant, setCurrentTenant] = useState<TenantStore>(TENANT_STORES[0]);
  const [b2bModeActive, setB2bModeActive] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [catalogues, setCatalogues] = useState<Catalogue[]>(INITIAL_CATALOGUES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(INITIAL_STOCK_MOVEMENTS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [whatsappTemplates, setWhatsappTemplates] = useState<WhatsAppTemplate[]>(INITIAL_WHATSAPP_TEMPLATES);
  const [liveVisitors, setLiveVisitors] = useState<LiveVisitor[]>(INITIAL_LIVE_VISITORS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM);

  // Storefront state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const switchTenant = (tenantId: string) => {
    const found = tenants.find(t => t.id === tenantId) || TENANT_STORES.find(t => t.id === tenantId);
    if (found) {
      setCurrentTenant(found);
      addToast(`Switched active store to "${found.name}"`, 'info');
    }
  };

  const updateTenant = (id: string, updated: Partial<TenantStore>) => {
    setTenants(prev => prev.map(t => (t.id === id ? { ...t, ...updated } : t)));
    setCurrentTenant(prev => (prev.id === id ? { ...prev, ...updated } : prev));
  };

  const updateTenantSettings = (updated: Partial<TenantStore>) => {
    updateTenant(currentTenant.id, updated);
    addToast('Store settings updated successfully', 'success');
  };

  const createTenant = (nameOrData: string | Partial<TenantStore>, customSlug?: string): TenantStore => {
    const newId = 'store_' + Date.now();
    let newTenant: TenantStore;

    if (typeof nameOrData === 'string') {
      const storeName = nameOrData;
      const s = customSlug || storeName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      newTenant = {
        id: newId,
        name: storeName,
        slug: s,
        tagline: 'Quality goods curated for you',
        logo: '🏬',
        bannerImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1600&q=80',
        currency: 'INR',
        currencySymbol: '₹',
        categoryTheme: 'General Store',
        primaryColor: '#0f172a',
        accentColor: '#3b82f6',
        fontFamily: 'Plus Jakarta Sans',
        email: `contact@${s}.com`,
        supportEmail: `support@${s}.com`,
        phone: '+91 98765 43210',
        supportPhone: '+91 98765 43210',
        customDomain: '',
        address: 'Main Market, City Center',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        supportHours: 'Mon - Sat: 9:00 AM - 8:00 PM',
        whatsappNumber: '+91 98765 43210',
        instagram: `@${s}`,
        theme: {
          primaryColor: '#0f172a',
          accentColor: '#3b82f6',
          fontFamily: 'Plus Jakarta Sans',
          bannerUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1600&q=80',
          announcementText: `Welcome to ${storeName}! Check out our latest products`,
          showAnnouncement: true,
        },
      };
    } else {
      const baseName = nameOrData.name || 'New Store';
      const s = nameOrData.slug || baseName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      newTenant = {
        id: newId,
        name: baseName,
        slug: s,
        tagline: nameOrData.tagline || 'Quality goods curated for you',
        logo: nameOrData.logo || '🏬',
        bannerImage: nameOrData.bannerImage || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1600&q=80',
        currency: nameOrData.currency || 'INR',
        currencySymbol: nameOrData.currencySymbol || '₹',
        categoryTheme: nameOrData.categoryTheme || 'General Store',
        primaryColor: nameOrData.primaryColor || '#0f172a',
        accentColor: nameOrData.accentColor || '#3b82f6',
        fontFamily: nameOrData.fontFamily || 'Plus Jakarta Sans',
        email: nameOrData.email || `contact@${s}.com`,
        supportEmail: nameOrData.supportEmail || `support@${s}.com`,
        phone: nameOrData.phone || '+91 98765 43210',
        supportPhone: nameOrData.supportPhone || '+91 98765 43210',
        customDomain: nameOrData.customDomain || '',
        address: nameOrData.address || 'Main Market, City Center',
        city: nameOrData.city || 'Mumbai',
        state: nameOrData.state || 'Maharashtra',
        pincode: nameOrData.pincode || '400001',
        supportHours: nameOrData.supportHours || 'Mon - Sat: 9:00 AM - 8:00 PM',
        whatsappNumber: nameOrData.whatsappNumber || '+91 98765 43210',
        instagram: nameOrData.instagram || `@${s}`,
        theme: nameOrData.theme || {
          primaryColor: nameOrData.primaryColor || '#0f172a',
          accentColor: nameOrData.accentColor || '#3b82f6',
          fontFamily: nameOrData.fontFamily || 'Plus Jakarta Sans',
          bannerUrl: nameOrData.bannerImage || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1600&q=80',
          announcementText: `Welcome to ${baseName}!`,
          showAnnouncement: true,
        },
      };
    }

    setTenants(prev => [...prev, newTenant]);
    setCurrentTenant(newTenant);
    addToast(`New store "${newTenant.name}" created and switched!`, 'success');
    return newTenant;
  };

  // Products CRUD
  const addProduct = (newProductData: Omit<Product, 'id' | 'tenantId' | 'updatedAt'>): Product => {
    const newProduct: Product = {
      ...newProductData,
      id: 'prod_' + Date.now(),
      tenantId: currentTenant.id,
      updatedAt: new Date().toISOString(),
    };
    setProducts(prev => [newProduct, ...prev]);

    // Also record stock in movement
    if (newProduct.stock > 0) {
      const movement: StockMovement = {
        id: 'mov_' + Date.now(),
        tenantId: currentTenant.id,
        productId: newProduct.id,
        productName: newProduct.name,
        sku: newProduct.sku,
        type: 'in',
        quantity: newProduct.stock,
        previousStock: 0,
        newStock: newProduct.stock,
        reason: 'Initial stock on product creation',
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        warehouse: 'Main Hub',
        performedBy: 'Store Admin',
      };
      setStockMovements(prev => [movement, ...prev]);
    }

    addToast(`Product "${newProduct.name}" created successfully!`, 'success');
    return newProduct;
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updated, updatedAt: new Date().toISOString() } : p))
    );
    addToast('Product updated successfully', 'success');
  };

  const deleteProduct = (id: string) => {
    const item = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    addToast(`Deleted product "${item?.name || id}"`, 'info');
  };

  const toggleProductStatus = (id: string) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const nextStatus = p.status === 'active' ? 'draft' : 'active';
          addToast(`Product status set to ${nextStatus}`, 'info');
          return { ...p, status: nextStatus, updatedAt: new Date().toISOString() };
        }
        return p;
      })
    );
  };

  // Categories
  const addCategory = (newCat: Omit<Category, 'id' | 'tenantId'>): Category => {
    const cat: Category = {
      ...newCat,
      id: 'cat_' + Date.now(),
      tenantId: currentTenant.id,
    };
    setCategories(prev => [...prev, cat]);
    addToast(`Category "${cat.name}" added`, 'success');
    return cat;
  };

  const updateCategory = (id: string, cat: Partial<Category>) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...cat } : c)));
    addToast('Category updated', 'success');
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    addToast('Category deleted', 'info');
  };

  // Catalogues
  const addCatalogue = (newCat: Omit<Catalogue, 'id' | 'tenantId' | 'lastUpdated'>): Catalogue => {
    const cat: Catalogue = {
      ...newCat,
      id: 'catlog_' + Date.now(),
      tenantId: currentTenant.id,
      lastUpdated: new Date().toISOString().split('T')[0],
      viewCount: 0,
    };
    setCatalogues(prev => [cat, ...prev]);
    addToast(`Catalogue "${cat.name}" published!`, 'success');
    return cat;
  };

  const updateCatalogue = (id: string, cat: Partial<Catalogue>) => {
    setCatalogues(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, ...cat, lastUpdated: new Date().toISOString().split('T')[0] }
          : c
      )
    );
    addToast('Catalogue changes saved', 'success');
  };

  const duplicateCatalogue = (id: string) => {
    const original = catalogues.find(c => c.id === id);
    if (!original) return;
    const duplicated: Catalogue = {
      ...original,
      id: 'catlog_' + Date.now(),
      name: `${original.name} (Copy)`,
      slug: `${original.slug}-copy`,
      lastUpdated: new Date().toISOString().split('T')[0],
      viewCount: 0,
    };
    setCatalogues(prev => [duplicated, ...prev]);
    addToast(`Duplicated "${original.name}"`, 'success');
  };

  const deleteCatalogue = (id: string) => {
    setCatalogues(prev => prev.filter(c => c.id !== id));
    addToast('Catalogue archived', 'info');
  };

  // Orders
  const updateOrderStatus = (orderId: string, status: Order['fulfillmentStatus']) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          const newTimeline = [...order.timeline];
          const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          newTimeline.push({
            status,
            title: `Order status changed to ${status.toUpperCase()}`,
            time: `${timeString}, Today`,
            completed: true,
          });
          return {
            ...order,
            fulfillmentStatus: status,
            timeline: newTimeline,
          };
        }
        return order;
      })
    );
    addToast(`Order ${orderId} updated to ${status}`, 'success');
  };

  const updatePaymentStatus = (orderId: string, status: Order['paymentStatus']) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, paymentStatus: status } : o))
    );
    addToast(`Payment marked as ${status}`, 'info');
  };

  const createOrderFromCart = (orderDetails: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: Order['shippingAddress'];
    paymentMethod: Order['paymentMethod'];
  }): Order => {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity, 0);
    const discount = appliedCoupon
      ? appliedCoupon.discountType === 'percentage'
        ? Math.min((subtotal * appliedCoupon.amount) / 100, appliedCoupon.maxDiscount || 999999)
        : appliedCoupon.amount
      : 0;
    const tax = Math.round(subtotal * 0.05);
    const shipping = subtotal > 999 ? 0 : 70;
    const total = Math.max(0, subtotal - discount + tax + shipping);

    const orderNumber = '#ORD-' + (1025 + orders.length);
    const newOrder: Order = {
      id: 'ord_' + Date.now(),
      tenantId: currentTenant.id,
      orderNumber,
      customerName: orderDetails.customerName,
      customerEmail: orderDetails.customerEmail,
      customerPhone: orderDetails.customerPhone,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80',
        sku: item.product.sku,
        price: item.product.salePrice || item.product.price,
        quantity: item.quantity,
        variantSelection: item.selectedVariant,
      })),
      subtotal,
      discount,
      couponCode: appliedCoupon?.code,
      tax,
      shipping,
      total,
      paymentStatus: orderDetails.paymentMethod === 'COD' ? 'pending' : 'paid',
      fulfillmentStatus: 'confirmed',
      paymentMethod: orderDetails.paymentMethod,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      shippingAddress: orderDetails.shippingAddress,
      billingAddress: orderDetails.shippingAddress,
      timeline: [
        { status: 'placed', title: 'Order Placed by Customer', time: 'Just now', completed: true },
        { status: 'confirmed', title: 'Order Confirmed & Sent to Store', time: 'Just now', completed: true },
      ],
    };

    setOrders(prev => [newOrder, ...prev]);

    // Deduct stock
    cart.forEach(item => {
      adjustStock(item.product.id, -item.quantity, `Fulfilled ${orderNumber}`, 'Main Hub');
    });

    // Create a transaction record
    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      tenantId: currentTenant.id,
      orderId: newOrder.id,
      invoiceNumber: `INV-2026-${orders.length + 885}`,
      customerName: newOrder.customerName,
      amount: newOrder.total,
      method: newOrder.paymentMethod,
      status: newOrder.paymentStatus,
      date: newOrder.date,
      fee: newOrder.paymentMethod === 'COD' ? 40 : 0,
      net: newOrder.total,
    };
    setTransactions(prev => [newTx, ...prev]);

    // Clear cart
    clearCart();
    addToast(`Order ${orderNumber} placed successfully!`, 'success');
    return newOrder;
  };

  // Stock Adjustment
  const adjustStock = (productId: string, quantityChange: number, reason: string, warehouse: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const previousStock = product.stock;
    const newStock = Math.max(0, previousStock + quantityChange);

    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, stock: newStock, updatedAt: new Date().toISOString() } : p))
    );

    const movement: StockMovement = {
      id: 'mov_' + Date.now() + Math.random().toString(36).substring(2, 4),
      tenantId: currentTenant.id,
      productId,
      productName: product.name,
      sku: product.sku,
      type: quantityChange > 0 ? 'in' : 'out',
      quantity: Math.abs(quantityChange),
      previousStock,
      newStock,
      reason,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      warehouse: warehouse || 'Main Hub',
      performedBy: 'Store Admin',
    };

    setStockMovements(prev => [movement, ...prev]);
    addToast(`Stock updated for ${product.name} (${previousStock} → ${newStock})`, 'info');
  };

  // Customer Note
  const addCustomerNote = (customerId: string, note: string) => {
    setCustomers(prev =>
      prev.map(c => (c.id === customerId ? { ...c, notes: (c.notes ? c.notes + '\n' : '') + note } : c))
    );
    addToast('Customer note added', 'success');
  };

  // Coupons
  const addCoupon = (couponData: Omit<Coupon, 'id' | 'tenantId' | 'usedCount'>) => {
    const coupon: Coupon = {
      ...couponData,
      id: 'coup_' + Date.now(),
      tenantId: currentTenant.id,
      usedCount: 0,
    };
    setCoupons(prev => [coupon, ...prev]);
    addToast(`Coupon "${coupon.code}" created!`, 'success');
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons(prev =>
      prev.map(c => (c.id === id ? { ...c, status: c.status === 'active' ? 'disabled' : 'active' } : c))
    );
    addToast('Coupon status updated', 'info');
  };

  // Banners
  const toggleBannerStatus = (id: string) => {
    setBanners(prev =>
      prev.map(b => (b.id === id ? { ...b, active: !b.active } : b))
    );
    addToast('Banner visibility updated', 'info');
  };

  // WhatsApp
  const sendWhatsAppBroadcast = (templateId: string, count: number = 25) => {
    setWhatsappTemplates(prev =>
      prev.map(t => (t.id === templateId ? { ...t, sentCount: t.sentCount + count, deliveredCount: t.deliveredCount + count - 1 } : t))
    );
    addToast(`WhatsApp campaign simulated: Sent to ${count} recipients`, 'success');
  };

  // Team
  const inviteTeamMember = (name: string, email: string, role: TeamMember['role']) => {
    const member: TeamMember = {
      id: 'tm_' + Date.now(),
      tenantId: currentTenant.id,
      name,
      email,
      role,
      status: 'invited',
      lastActive: 'Invitation Pending',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
    };
    setTeamMembers(prev => [...prev, member]);
    addToast(`Invitation sent to ${email}`, 'success');
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
    addToast('Team member removed', 'info');
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1, variant?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.selectedVariant === variant);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && item.selectedVariant === variant
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedVariant: variant }];
    });
    addToast(`Added ${quantity}x "${product.name.substring(0, 24)}..." to cart`, 'success');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    addToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const found = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.status === 'active');
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    const subtotal = cart.reduce((sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity, 0);
    if (subtotal < found.minOrder) {
      return { success: false, message: `Minimum order value of ₹${found.minOrder.toLocaleString('en-IN')} required for this coupon.` };
    }
    setAppliedCoupon(found);
    addToast(`Coupon "${found.code}" applied!`, 'success');
    return { success: true, message: `Applied discount successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon removed', 'info');
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        addToast('Removed from wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        addToast('Added to wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Periodic simulated live visitors update to make the platform feel truly live
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVisitors(prev => {
        const randomIndex = Math.floor(Math.random() * prev.length);
        const updated = [...prev];
        const item = updated[randomIndex];
        if (item) {
          const seconds = Math.floor(Math.random() * 50) + 10;
          updated[randomIndex] = {
            ...item,
            timeActive: `${Math.floor(seconds / 60)}m ${seconds % 60}s`,
          };
        }
        return updated;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <StoreContext.Provider
      value={{
        currentTenant,
        availableTenants: tenants,
        tenants,
        switchTenant,
        updateTenantSettings,
        updateTenant,
        createTenant,
        b2bModeActive,
        setB2bModeActive,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStatus,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        catalogues,
        addCatalogue,
        updateCatalogue,
        duplicateCatalogue,
        deleteCatalogue,
        orders,
        updateOrderStatus,
        updatePaymentStatus,
        createOrderFromCart,
        customers,
        addCustomerNote,
        stockMovements,
        adjustStock,
        coupons,
        addCoupon,
        toggleCouponStatus,
        banners,
        toggleBannerStatus,
        whatsappTemplates,
        sendWhatsAppBroadcast,
        liveVisitors,
        transactions,
        teamMembers,
        inviteTeamMember,
        removeTeamMember,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
