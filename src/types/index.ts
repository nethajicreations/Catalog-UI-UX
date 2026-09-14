export type Currency = 'INR' | 'USD' | 'EUR';

export interface StoreTheme {
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  bannerUrl: string;
  announcementText: string;
  showAnnouncement: boolean;
}

export interface TenantStore {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  logo: string;
  bannerImage: string;
  currency: string;
  currencySymbol: string;
  categoryTheme: string;
  primaryColor: string; // hex
  accentColor: string;
  fontFamily: string;
  email: string;
  supportEmail?: string;
  phone: string;
  supportPhone: string;
  customDomain?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  supportHours: string;
  whatsappNumber: string;
  instagram: string;
  theme: StoreTheme;
}

export type Tenant = TenantStore;

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Size", "Color"
  options: string[]; // ["S", "M", "L"]
}

export interface Product {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  sku: string;
  barcode?: string;
  category: string;
  subcategory?: string;
  brand: string;
  price: number;
  salePrice?: number;
  costPrice: number;
  stock: number;
  lowStockThreshold: number;
  status: 'active' | 'draft' | 'archived';
  images: string[];
  shortDescription: string;
  description: string;
  tags: string[];
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  wholesalePrice?: number;
  b2bMinQty?: number;
  weightKg?: number;
  dimensions?: { l: number; w: number; h: number };
  seoTitle?: string;
  seoDescription?: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  parentId?: string | null;
  image: string;
  productCount: number;
  visibility: 'visible' | 'hidden';
  status: 'active' | 'inactive';
  description?: string;
}

export interface Catalogue {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  productIds: string[];
  categoryIds: string[];
  customerAccess: 'public' | 'private' | 'b2b_only' | 'vip_only';
  pricingMode: 'retail' | 'wholesale' | 'tiered' | 'inquire_only';
  visibility: 'published' | 'draft' | 'scheduled';
  layoutStyle: 'grid_modern' | 'magazine' | 'compact_b2b' | 'showcase_slider';
  primaryColor: string;
  showPrices: boolean;
  allowDirectOrder: boolean;
  enableWhatsAppCheckout: boolean;
  viewCount: number;
  lastUpdated: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  price: number;
  quantity: number;
  variantSelection?: string;
}

export interface Order {
  id: string;
  tenantId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number;
  shipping: number;
  total: number;
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  fulfillmentStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'COD' | 'UPI' | 'Credit Card' | 'Net Banking' | 'Razorpay' | 'Bank Transfer';
  date: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  timeline: {
    status: string;
    title: string;
    time: string;
    note?: string;
    completed: boolean;
  }[];
}

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  customerGroup: 'Retail' | 'Wholesale' | 'VIP' | 'Distributor';
  status: 'active' | 'inactive';
  favoriteCategory: string;
  addresses: {
    type: 'Home' | 'Work' | 'Warehouse';
    street: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
  }[];
  notes?: string;
  tags: string[];
}

export interface StockMovement {
  id: string;
  tenantId: string;
  productId: string;
  productName: string;
  sku: string;
  type: 'in' | 'out' | 'adjustment' | 'return';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  date: string;
  warehouse: string;
  performedBy: string;
}

export interface Coupon {
  id: string;
  tenantId: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  amount: number;
  minOrder: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  expiration: string;
  status: 'active' | 'expired' | 'disabled';
  description: string;
}

export interface Banner {
  id: string;
  tenantId: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  badge?: string;
  position: 'hero' | 'top_strip' | 'middle_promo' | 'category_header';
  active: boolean;
  startDate: string;
  endDate: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: 'order_update' | 'marketing' | 'abandoned_cart' | 'payment_reminder';
  language: string;
  content: string;
  status: 'approved' | 'pending' | 'draft';
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  conversionCount: number;
}

export interface LiveVisitor {
  id: string;
  visitorNumber: string;
  country: string;
  city: string;
  currentPage: string;
  productViewed?: string;
  timeActive: string;
  device: 'mobile' | 'desktop' | 'tablet';
  referrer: string;
  cartTotal?: number;
}

export interface Transaction {
  id: string;
  tenantId: string;
  orderId: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  method: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  date: string;
  fee: number;
  net: number;
}

export interface TeamMember {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Manager' | 'Staff' | 'Viewer';
  status: 'active' | 'invited';
  lastActive: string;
  avatar: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}
