import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export interface User {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: number
  name: string
  description: string | null
  price: string
  stock: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: string
  created_at: string
  updated_at: string
  product: Product
}

export interface Order {
  id: number
  user_id: number
  order_number: string
  total: string
  address: string
  phone: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
  updated_at: string
  order_items: OrderItem[]
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface ProductData {
  name: string
  description?: string
  price: number
  stock: number
  is_active?: boolean
}

export interface OrderData {
  items: Array<{
    product_id: number
    quantity: number
  }>
  address: string
  phone: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  errors?: Record<string, string[]>
}

// Auth API
export const authAPI = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  async register(data: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  async logout(): Promise<ApiResponse<null>> {
    const response = await api.post('/auth/logout')
    return response.data
  },

  async me(): Promise<ApiResponse<{ user: User }>> {
    const response = await api.get('/auth/me')
    return response.data
  },

  async refresh(): Promise<ApiResponse<{ token: string }>> {
    const response = await api.post('/auth/refresh')
    return response.data
  },
}

// Products API
export const productsAPI = {
  async getProducts(params?: {
    search?: string
    status?: string
    sort_by?: string
    sort_order?: string
    per_page?: number
    page?: number
  }): Promise<PaginatedResponse<Product>> {
    const response = await api.get('/products', { params })
    return response.data
  },

  async getProduct(id: number): Promise<ApiResponse<Product>> {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  async createProduct(data: ProductData): Promise<ApiResponse<Product>> {
    const response = await api.post('/products', data)
    return response.data
  },

  async updateProduct(id: number, data: Partial<ProductData>): Promise<ApiResponse<Product>> {
    const response = await api.put(`/products/${id}`, data)
    return response.data
  },

  async deleteProduct(id: number): Promise<ApiResponse<null>> {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },
}

// Orders API
export const ordersAPI = {
  async getOrders(params?: {
    status?: string
    sort_by?: string
    sort_order?: string
    per_page?: number
    page?: number
  }): Promise<PaginatedResponse<Order>> {
    const response = await api.get('/orders', { params })
    return response.data
  },

  async getOrder(id: number): Promise<ApiResponse<Order>> {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  async createOrder(data: OrderData): Promise<ApiResponse<{
    order_number: string
    total: string
    items_count: number
    order: Order
  }>> {
    const response = await api.post('/orders', data)
    return response.data
  },
}

// Dashboard API
export const dashboardAPI = {
  async getStats(): Promise<ApiResponse<{
    total_products: number
    total_orders: number
    total_users: number
    recent_orders: Order[]
  }>> {
    const response = await api.get('/dashboard/stats')
    return response.data
  },
}

export default api
