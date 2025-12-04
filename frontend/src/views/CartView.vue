<template>
  <div class="px-4 py-6 sm:px-0">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
      <p class="text-lg text-gray-600">
        Review your items and proceed to checkout.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="cartStore.loading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>

    <!-- Error State -->
    <AlertMessage 
      v-if="cartStore.error" 
      type="error" 
      :message="cartStore.error" 
      class="mb-6"
      @close="cartStore.error = ''"
    />

    <!-- Success Message -->
    <AlertMessage 
      v-if="successMessage" 
      type="success" 
      :message="successMessage" 
      class="mb-6"
      @close="successMessage = ''"
    />

    <!-- Empty Cart -->
    <div v-if="!cartStore.loading && cartStore.isCartEmpty" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15.5M7 13h10m0 0v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
      <p class="mt-1 text-sm text-gray-500">Start shopping to add items to your cart.</p>
      <div class="mt-6">
        <router-link
          to="/products"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Browse Products
        </router-link>
      </div>
    </div>

    <!-- Cart Items -->
    <div v-if="!cartStore.loading && !cartStore.isCartEmpty" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart Items List -->
      <div class="lg:col-span-2">
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Cart Items ({{ cartStore.cartItemsCount }})</h3>
          </div>
          
          <div class="divide-y divide-gray-200">
            <div v-for="item in cartStore.cartItems" :key="item.id" class="p-6">
              <div class="flex items-center space-x-4">
                <!-- Product Info -->
                <div class="flex-1 min-w-0">
                  <h4 class="text-lg font-medium text-gray-900 truncate">
                    {{ item.product.name }}
                  </h4>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ item.product.description }}
                  </p>
                  <div class="flex items-center mt-2 space-x-4">
                    <span class="text-lg font-semibold text-gray-900">
                      ${{ item.product.price }}
                    </span>
                    <span class="text-sm text-gray-500">
                      Stock: {{ item.product.stock }}
                    </span>
                    <span :class="getStatusBadgeClass(item.product.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ item.product.status }}
                    </span>
                  </div>
                </div>

                <!-- Quantity Controls -->
                <div class="flex items-center space-x-2">
                  <button
                    @click="updateQuantity(item, item.quantity - 1)"
                    :disabled="item.quantity <= 1 || updating"
                    class="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                    </svg>
                  </button>
                  
                  <input
                    v-model.number="item.quantity"
                    @blur="updateQuantity(item, item.quantity)"
                    @keyup.enter="updateQuantity(item, item.quantity)"
                    type="number"
                    min="1"
                    :max="item.product.stock"
                    class="w-16 text-center border border-gray-300 rounded-md py-1 px-2 text-sm"
                    :disabled="updating"
                  />
                  
                  <button
                    @click="updateQuantity(item, item.quantity + 1)"
                    :disabled="item.quantity >= item.product.stock || updating"
                    class="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>

                <!-- Subtotal -->
                <div class="text-right">
                  <div class="text-lg font-semibold text-gray-900">
                    ${{ (item.product.price * item.quantity).toFixed(2) }}
                  </div>
                  <button
                    @click="removeItem(item)"
                    :disabled="updating"
                    class="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white shadow rounded-lg p-6 sticky top-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
          
          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Items ({{ cartStore.cartItemsCount }})</span>
              <span class="text-gray-900">${{ cartStore.cartTotal.toFixed(2) }}</span>
            </div>
            
            <div class="border-t border-gray-200 pt-3">
              <div class="flex justify-between text-lg font-semibold">
                <span class="text-gray-900">Total</span>
                <span class="text-gray-900">${{ cartStore.cartTotal.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <div class="mt-6 space-y-3">
            <button
              @click="showCheckoutModal = true"
              :disabled="cartStore.isCartEmpty || updating"
              class="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed to Checkout
            </button>
            
            <button
              @click="clearCart"
              :disabled="cartStore.isCartEmpty || updating"
              class="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Checkout Modal -->
    <CheckoutModal
      v-if="showCheckoutModal"
      :cart-total="cartStore.cartTotal"
      :cart-items-count="cartStore.cartItemsCount"
      @close="showCheckoutModal = false"
      @order-created="handleOrderCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCartStore, type CartItem } from '@/stores/cart'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import AlertMessage from '@/components/AlertMessage.vue'
import CheckoutModal from '@/components/CheckoutModal.vue'

const cartStore = useCartStore()
const updating = ref(false)
const successMessage = ref('')
const showCheckoutModal = ref(false)

const updateQuantity = async (item: CartItem, newQuantity: number) => {
  if (newQuantity < 1 || newQuantity > item.product.stock || newQuantity === item.quantity) {
    return
  }

  try {
    updating.value = true
    const result = await cartStore.updateCartItem(item.id, newQuantity)
    
    if (result.success) {
      successMessage.value = result.message
    }
  } catch (error) {
    console.error('Error updating quantity:', error)
  } finally {
    updating.value = false
  }
}

const removeItem = async (item: CartItem) => {
  if (!confirm(`Remove "${item.product.name}" from your cart?`)) {
    return
  }

  try {
    updating.value = true
    const result = await cartStore.removeFromCart(item.id)
    
    if (result.success) {
      successMessage.value = result.message
    }
  } catch (error) {
    console.error('Error removing item:', error)
  } finally {
    updating.value = false
  }
}

const clearCart = async () => {
  if (!confirm('Are you sure you want to clear your entire cart?')) {
    return
  }

  try {
    updating.value = true
    const result = await cartStore.clearCart()
    
    if (result.success) {
      successMessage.value = result.message
    }
  } catch (error) {
    console.error('Error clearing cart:', error)
  } finally {
    updating.value = false
  }
}

const handleOrderCreated = (orderData: any) => {
  showCheckoutModal.value = false
  successMessage.value = `Order ${orderData.order_number} created successfully!`
  
  // Optionally redirect to orders page
  setTimeout(() => {
    // router.push('/orders')
  }, 2000)
}

const getStatusBadgeClass = (status: string): string => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    out_of_stock: 'bg-yellow-100 text-yellow-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

onMounted(() => {
  cartStore.fetchCart()
})
</script>
