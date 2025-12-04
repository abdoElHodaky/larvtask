<template>
  <div class="px-4 py-6 sm:px-0">
    <!-- Header -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <nav class="flex" aria-label="Breadcrumb">
          <ol role="list" class="flex items-center space-x-4">
            <li>
              <div>
                <router-link to="/orders" class="text-gray-400 hover:text-gray-500">
                  <svg class="flex-shrink-0 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" clip-rule="evenodd" />
                  </svg>
                  <span class="sr-only">Orders</span>
                </router-link>
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <router-link to="/orders" class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">Orders</router-link>
              </div>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="ml-4 text-sm font-medium text-gray-500">{{ order?.order_number || 'Loading...' }}</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 class="mt-2 text-2xl font-semibold text-gray-900">
          Order #{{ order?.order_number || 'Loading...' }}
        </h1>
      </div>
    </div>

    <!-- Alerts -->
    <AlertMessage
      v-if="alertMessage"
      :type="alertType"
      :message="alertMessage"
      @dismiss="clearAlert"
      :auto-hide="true"
    />

    <!-- Loading State -->
    <LoadingSpinner v-if="loading" />

    <!-- Order Details -->
    <div v-else-if="order" class="mt-6">
      <!-- Order Summary -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Order Information</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Order details and status</p>
        </div>
        <div class="border-t border-gray-200">
          <dl>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Order Number</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ order.order_number }}</dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Status</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span :class="getStatusBadgeClass(order.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ formatStatus(order.status) }}
                </span>
              </dd>
            </div>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Total Amount</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-semibold">${{ order.total }}</dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Order Date</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ formatDate(order.created_at) }}</dd>
            </div>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Customer</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ order.user?.name || 'N/A' }}</dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Phone</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ order.phone }}</dd>
            </div>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Delivery Address</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ order.address }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Order Items -->
      <div class="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Order Items</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Products included in this order</p>
        </div>
        <div class="border-t border-gray-200">
          <ul role="list" class="divide-y divide-gray-200">
            <li v-for="item in order.order_items" :key="item.id" class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                      <svg class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-900">{{ item.product?.name || 'Product not found' }}</p>
                    <p class="text-sm text-gray-500">{{ item.product?.description || 'No description' }}</p>
                    <div class="mt-1 flex items-center text-sm text-gray-500">
                      <span>Quantity: {{ item.quantity }}</span>
                      <span class="mx-2">•</span>
                      <span>Unit Price: ${{ item.price }}</span>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">${{ (parseFloat(item.price) * item.quantity).toFixed(2) }}</p>
                  <p class="text-sm text-gray-500">Subtotal</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        
        <!-- Order Total -->
        <div class="bg-gray-50 px-4 py-4 sm:px-6">
          <div class="flex justify-between">
            <div class="text-sm font-medium text-gray-900">Total</div>
            <div class="text-lg font-semibold text-gray-900">${{ order.total }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="!loading" class="mt-6 text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Order not found</h3>
      <p class="mt-1 text-sm text-gray-500">The order you're looking for doesn't exist or you don't have permission to view it.</p>
      <div class="mt-6">
        <router-link
          to="/orders"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back to Orders
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ordersAPI, type Order } from '@/services/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import AlertMessage from '@/components/AlertMessage.vue'

const route = useRoute()

// State
const order = ref<Order | null>(null)
const loading = ref(false)
const alertMessage = ref('')
const alertType = ref<'success' | 'error' | 'warning' | 'info'>('info')

// Methods
const loadOrder = async () => {
  const orderId = route.params.id as string
  if (!orderId) return

  loading.value = true
  try {
    const response = await ordersAPI.getOrder(parseInt(orderId))
    if (response.success && response.data) {
      order.value = response.data
    } else {
      showAlert('error', 'Failed to load order details')
    }
  } catch (error: any) {
    if (error.response?.status === 403) {
      showAlert('error', 'You do not have permission to view this order')
    } else if (error.response?.status === 404) {
      showAlert('error', 'Order not found')
    } else {
      showAlert('error', error.response?.data?.message || 'Failed to load order details')
    }
  } finally {
    loading.value = false
  }
}

const showAlert = (type: typeof alertType.value, message: string) => {
  alertType.value = type
  alertMessage.value = message
}

const clearAlert = () => {
  alertMessage.value = ''
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'processing':
      return 'bg-blue-100 text-blue-800'
    case 'shipped':
      return 'bg-indigo-100 text-indigo-800'
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Lifecycle
onMounted(() => {
  loadOrder()
})
</script>
