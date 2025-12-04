<template>
  <div class="px-4 py-6 sm:px-0">
    <!-- Header -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Orders</h1>
        <p class="mt-2 text-sm text-gray-700">
          View and manage customer orders and their status.
        </p>
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

    <!-- Filters -->
    <div class="mt-6 bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
            <select
              v-model="statusFilter"
              id="status"
              name="status"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label for="sort" class="block text-sm font-medium text-gray-700">Sort By</label>
            <select
              v-model="sortBy"
              id="sort"
              name="sort"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="created_at">Date Created</option>
              <option value="total">Total Amount</option>
              <option value="status">Status</option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              @click="() => loadOrders()"
              type="button"
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Orders List -->
    <div class="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
      <LoadingSpinner v-if="loading" />
      
      <div v-else-if="orders.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No orders</h3>
        <p class="mt-1 text-sm text-gray-500">No orders have been placed yet.</p>
      </div>

      <ul v-else role="list" class="divide-y divide-gray-200">
        <li v-for="order in orders" :key="order.id" class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                  <svg class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <div class="flex items-center">
                  <p class="text-sm font-medium text-gray-900">Order #{{ order.order_number }}</p>
                  <span :class="getStatusBadgeClass(order.status)" class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ formatStatus(order.status) }}
                  </span>
                </div>
                <div class="mt-1 flex items-center text-sm text-gray-500">
                  <span class="font-medium">${{ order.total }}</span>
                  <span class="mx-2">•</span>
                  <span>{{ order.order_items?.length || 0 }} items</span>
                  <span class="mx-2">•</span>
                  <span>{{ formatDate(order.created_at) }}</span>
                </div>
                <div class="mt-1 text-sm text-gray-500">
                  <p class="truncate">{{ order.address }}</p>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <router-link
                :to="`/orders/${order.id}`"
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View Details
              </router-link>
            </div>
          </div>
        </li>
      </ul>

      <!-- Pagination -->
      <div v-if="pagination && pagination.last_page > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="loadOrders(pagination.current_page - 1)"
            :disabled="pagination.current_page <= 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            @click="loadOrders(pagination.current_page + 1)"
            :disabled="pagination.current_page >= pagination.last_page"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ (pagination.current_page - 1) * pagination.per_page + 1 }}</span>
              to
              <span class="font-medium">{{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }}</span>
              of
              <span class="font-medium">{{ pagination.total }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                @click="loadOrders(pagination.current_page - 1)"
                :disabled="pagination.current_page <= 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <button
                @click="loadOrders(pagination.current_page + 1)"
                :disabled="pagination.current_page >= pagination.last_page"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ordersAPI, type Order, type PaginatedResponse } from '@/services/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import AlertMessage from '@/components/AlertMessage.vue'

// State
const orders = ref<Order[]>([])
const loading = ref(false)
const pagination = ref<PaginatedResponse<Order>['pagination'] | null>(null)
const statusFilter = ref('')
const sortBy = ref('created_at')
const alertMessage = ref('')
const alertType = ref<'success' | 'error' | 'warning' | 'info'>('info')

// Methods
const loadOrders = async (page = 1) => {
  loading.value = true
  try {
    const params = {
      page,
      status: statusFilter.value || undefined,
      sort_by: sortBy.value,
      sort_order: 'desc',
      per_page: 15
    }
    
    const response = await ordersAPI.getOrders(params)
    if (response.success) {
      orders.value = response.data
      pagination.value = response.pagination
    } else {
      showAlert('error', 'Failed to load orders')
    }
  } catch (error: any) {
    showAlert('error', error.response?.data?.message || 'Failed to load orders')
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
  return new Date(dateString).toLocaleDateString()
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

// Watchers
watch([statusFilter, sortBy], () => {
  loadOrders()
})

// Lifecycle
onMounted(() => {
  loadOrders()
})
</script>
