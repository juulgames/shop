export interface Filament {
  id: string;
  name: string;
  material: string;
  colorHex: string;
  brand?: string;
  inStock: boolean;
  notes?: string;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  inventory: number;
  material?: string;
  colorOptions?: string[];
  supportsMultiColor?: boolean;
  options?: ProductOption[];
  printTimeHours?: number;
  dimensions?: string;
  paypalPaymentLink?: string;
  badge?: string;
  rating?: number;
  reviewsCount?: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSecondaryColor?: string;
  selectedOptions?: Record<string, string>;
}

export interface CustomerInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}

export interface Order {
  id: string;
  date: string;
  customer: CustomerInfo;
  items: {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    imageUrl: string;
    selectedColor?: string;
    material?: string;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: 'paypal' | 'cash';
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
}

export interface CustomQuoteRequest {
  id: string;
  name: string;
  email: string;
  projectDescription: string;
  fileUrlOrDetails: string;
  material: string;
  color: string;
  infill: string;
  estimatedPrice: number;
  date: string;
  status: 'new' | 'quoted' | 'approved';
}

export interface AccessGateSettings {
  enabled: boolean;
  storePassword: string;
  allowLocationAccess: boolean;
  locationType: 'radius' | 'postal_codes' | 'city' | 'country';
  workshopCity: string;
  workshopLat: number;
  workshopLng: number;
  radiusKm: number;
  allowedPostalCodes: string[];
  allowedCity: string;
  allowedCountry: string;
  headline: string;
  subheadline: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  currencySymbol: string;
  currencyCode: string;
  supportEmail: string;
  bannerNotice: string;
  logoUrl?: string;
  paypalUsernameOrEmail: string;
  freeShippingThreshold: number;
  leadTimeDays: number;
  customDomain?: string;
  accessGate?: AccessGateSettings;
  adminPin?: string;
  themeStyle?: 'amber' | 'emerald' | 'cyan' | 'obsidian';
}
