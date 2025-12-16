// API Response Types based on backend entities

export interface User {
  id: number;
  userId: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  categoryId: string;
  name: string;
  description: string;
  imgUrl?: string;
  bgColor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: number;
  brandId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  id: number;
  itemId: string;
  name: string;
  description: string;
  price: number;
  imgUrl?: string;
  stockQuantity: number;
  category: Category;
  brand?: Brand;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  id: number;
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Sale {
  id: number;
  saleId: string;
  customerName: string;
  phoneNumber: string;
  subtotal: number;
  grandTotal: number;
  createdAt: string;
  items: SaleItem[];
  paymentMethod: 'CASH' | 'UPI';
}

export interface Favorite {
  id: number;
  item: Item;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

// API Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface SaleRequest {
  customerName: string;
  phoneNumber: string;
  cartItems: Array<{
    itemId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  grandTotal: number;
  paymentMethod: 'CASH' | 'UPI';
}

// API Response Types
export interface AuthResponse {
  email: string;
  token: string;
  role: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

// Redux State Types
export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface CartItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  imgUrl?: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
}

export interface FavoritesState {
  items: Item[];
  isLoading: boolean;
}