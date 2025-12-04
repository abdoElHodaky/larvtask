<template>
  <div class="px-4 py-6 sm:px-0">
    <!-- Header -->
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-semibold text-gray-900">Products</h1>
        <p class="mt-2 text-sm text-gray-700">
          Manage your product inventory, pricing, and availability.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          @click="openCreateModal"
          type="button"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
        >
          Add Product
        </button>
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

    <!-- Search and Filters -->
    <div class="mt-6 bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
            <input
              v-model="searchQuery"
              type="text"
              name="search"
              id="search"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Search products..."
            />
          </div>
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
            <select
              v-model="statusFilter"
              id="status"
              name="status"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Products</option>
              <option value="active">Active</option>
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              @click="() => loadProducts()"
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

    <!-- Products Table -->
    <div class="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
      <LoadingSpinner v-if="loading" />
      
      <div v-else-if="products.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No products</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
        <div class="mt-6">
          <button
            @click="openCreateModal"
            type="button"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            New Product
          </button>
        </div>
      </div>

      <ul v-else role="list" class="divide-y divide-gray-200">
        <li v-for="product in products" :key="product.id" class="px-6 py-4">
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
                <div class="flex items-center">
                  <p class="text-sm font-medium text-gray-900">{{ product.name }}</p>
                  <span
                    v-if="!product.is_active"
                    class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                  >
                    Inactive
                  </span>
                  <span
                    v-else-if="product.stock <= 0"
                    class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                  >
                    Out of Stock
                  </span>
                  <span
                    v-else
                    class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    In Stock
                  </span>
                </div>
                <p class="text-sm text-gray-500">{{ product.description || 'No description' }}</p>
                <div class="mt-1 flex items-center text-sm text-gray-500">
                  <span class="font-medium">${{ product.price }}</span>
                  <span class="mx-2">•</span>
                  <span>{{ product.stock }} in stock</span>
                  <span class="mx-2">•</span>
                  <span>Created {{ formatDate(product.created_at) }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="addToCart(product)"
                :disabled="!product.is_active || product.stock <= 0 || cartStore.loading"
                class="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="-ml-1 mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15.5M7 13h10m0 0v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6z" />
                </svg>
                Add to Cart
              </button>
              <button
                @click="editProduct(product)"
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit
              </button>
              <button
                @click="confirmDelete(product)"
                class="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      </ul>

      <!-- Pagination -->
      <div v-if="pagination && pagination.last_page > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="loadProducts(pagination.current_page - 1)"
            :disabled="pagination.current_page <= 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            @click="loadProducts(pagination.current_page + 1)"
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
                @click="loadProducts(pagination.current_page - 1)"
                :disabled="pagination.current_page <= 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <button
                @click="loadProducts(pagination.current_page + 1)"
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

    <!-- Product Form Modal -->
    <ProductFormModal
      v-if="showModal"
      :product="selectedProduct"
      @close="closeModal"
      @saved="handleProductSaved"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmModal
      v-if="showDeleteModal"
      :title="'Delete Product'"
      :message="`Are you sure you want to delete '${productToDelete?.name}'? This action cannot be undone.`"
      @confirm="handleDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { productsAPI, type Product, type PaginatedResponse } from '@/services/api'
import { useCartStore } from '@/stores/cart'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import AlertMessage from '@/components/AlertMessage.vue'
import ProductFormModal from '@/components/ProductFormModal.vue'
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue'

// State
const cartStore = useCartStore()
const products = ref<Product[]>([])
const loading = ref(false)
const pagination = ref<PaginatedResponse<Product>['pagination'] | null>(null)
const searchQuery = ref('')
const statusFilter = ref('')
const showModal = ref(false)
const showDeleteModal = ref(false)
const selectedProduct = ref<Product | null>(null)
const productToDelete = ref<Product | null>(null)
const alertMessage = ref('')
const alertType = ref<'success' | 'error' | 'warning' | 'info'>('info')

// Methods
const loadProducts = async (page = 1) => {
  loading.value = true
  try {
    const params = {
      page,
      search: searchQuery.value || undefined,
      status: statusFilter.value || undefined,
      per_page: 15
    }
    
    const response = await productsAPI.getProducts(params)
    if (response.success) {
      products.value = response.data
      pagination.value = response.pagination
    } else {
      showAlert('error', 'Failed to load products')
    }
  } catch (error: any) {
    showAlert('error', error.response?.data?.message || 'Failed to load products')
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  selectedProduct.value = null
  showModal.value = true
}

const editProduct = (product: Product) => {
  selectedProduct.value = product
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedProduct.value = null
}

const handleProductSaved = () => {
  closeModal()
  loadProducts()
  showAlert('success', selectedProduct.value ? 'Product updated successfully' : 'Product created successfully')
}

const confirmDelete = (product: Product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (!productToDelete.value) return
  
  try {
    const response = await productsAPI.deleteProduct(productToDelete.value.id)
    if (response.success) {
      showAlert('success', 'Product deleted successfully')
      loadProducts()
    } else {
      showAlert('error', 'Failed to delete product')
    }
  } catch (error: any) {
    showAlert('error', error.response?.data?.message || 'Failed to delete product')
  } finally {
    showDeleteModal.value = false
    productToDelete.value = null
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

const addToCart = async (product: Product) => {
  try {
    const result = await cartStore.addToCart(product.id, 1)
    
    if (result.success) {
      showAlert('success', result.message)
    } else {
      showAlert('error', result.message)
    }
  } catch (error) {
    console.error('Error adding to cart:', error)
    showAlert('error', 'Failed to add item to cart')
  }
}

// Watchers
let debounceTimer: number | null = null
watch([searchQuery, statusFilter], () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  debounceTimer = setTimeout(() => {
    loadProducts()
  }, 300)
})

// Lifecycle
onMounted(() => {
  loadProducts()
})
</script>
