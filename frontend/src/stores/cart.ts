import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

export interface CartItem {
  id: number
  user_id: number
  product_id: number
  quantity: number
  created_at: string
  updated_at: string
  product: {
    id: number
    name: string
    description: string
    price: number
    stock: number
    status: string
    created_at: string
    updated_at: string
  }
  subtotal: number
}

export interface CartData {
  items: CartItem[]
  total: number
  items_count: number
}

export const useCartStore = defineStore('cart', () => {
  const cartData = ref<CartData>({
    items: [],
    total: 0,
    items_count: 0
  })
  const loading = ref(false)
  const error = ref('')

  // Computed properties
  const cartItems = computed(() => cartData.value.items)
  const cartTotal = computed(() => cartData.value.total)
  const cartItemsCount = computed(() => cartData.value.items_count)
  const isCartEmpty = computed(() => cartData.value.items.length === 0)

  // Actions
  const fetchCart = async () => {
    try {
      loading.value = true
      error.value = ''
      
      const response = await api.get('/cart')
      
      if (response.data.success) {
        cartData.value = response.data.data
      } else {
        error.value = response.data.message || 'Failed to load cart'
      }
    } catch (err: any) {
      console.error('Error fetching cart:', err)
      error.value = err.response?.data?.message || 'Failed to load cart'
    } finally {
      loading.value = false
    }
  }

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      loading.value = true
      error.value = ''
      
      const response = await api.post('/cart', {
        product_id: productId,
        quantity
      })
      
      if (response.data.success) {
        // Refresh cart data
        await fetchCart()
        return { success: true, message: response.data.message }
      } else {
        error.value = response.data.message || 'Failed to add item to cart'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      console.error('Error adding to cart:', err)
      error.value = err.response?.data?.message || 'Failed to add item to cart'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateCartItem = async (cartItemId: number, quantity: number) => {
    try {
      loading.value = true
      error.value = ''
      
      const response = await api.put(`/cart/${cartItemId}`, {
        quantity
      })
      
      if (response.data.success) {
        // Refresh cart data
        await fetchCart()
        return { success: true, message: response.data.message }
      } else {
        error.value = response.data.message || 'Failed to update cart item'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      console.error('Error updating cart item:', err)
      error.value = err.response?.data?.message || 'Failed to update cart item'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const removeFromCart = async (cartItemId: number) => {
    try {
      loading.value = true
      error.value = ''
      
      const response = await api.delete(`/cart/${cartItemId}`)
      
      if (response.data.success) {
        // Refresh cart data
        await fetchCart()
        return { success: true, message: response.data.message }
      } else {
        error.value = response.data.message || 'Failed to remove item from cart'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      console.error('Error removing from cart:', err)
      error.value = err.response?.data?.message || 'Failed to remove item from cart'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const clearCart = async () => {
    try {
      loading.value = true
      error.value = ''
      
      const response = await api.delete('/cart')
      
      if (response.data.success) {
        cartData.value = {
          items: [],
          total: 0,
          items_count: 0
        }
        return { success: true, message: response.data.message }
      } else {
        error.value = response.data.message || 'Failed to clear cart'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      console.error('Error clearing cart:', err)
      error.value = err.response?.data?.message || 'Failed to clear cart'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const createOrderFromCart = async (orderData: { address: string; phone: string }) => {
    try {
      loading.value = true
      error.value = ''
      
      const response = await api.post('/orders', {
        ...orderData,
        use_cart: true
      })
      
      if (response.data.success) {
        // Clear cart data since order was created successfully
        cartData.value = {
          items: [],
          total: 0,
          items_count: 0
        }
        return { success: true, data: response.data.data, message: response.data.message }
      } else {
        error.value = response.data.message || 'Failed to create order'
        return { success: false, message: error.value }
      }
    } catch (err: any) {
      console.error('Error creating order from cart:', err)
      error.value = err.response?.data?.message || 'Failed to create order'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  // Helper function to get cart item by product ID
  const getCartItemByProductId = (productId: number): CartItem | undefined => {
    return cartData.value.items.find(item => item.product_id === productId)
  }

  // Helper function to check if product is in cart
  const isProductInCart = (productId: number): boolean => {
    return cartData.value.items.some(item => item.product_id === productId)
  }

  return {
    // State
    cartData,
    loading,
    error,
    
    // Computed
    cartItems,
    cartTotal,
    cartItemsCount,
    isCartEmpty,
    
    // Actions
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    createOrderFromCart,
    
    // Helpers
    getCartItemByProductId,
    isProductInCart
  }
})
