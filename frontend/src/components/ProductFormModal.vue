<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <form @submit.prevent="handleSubmit">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {{ isEditing ? 'Edit Product' : 'Create Product' }}
                </h3>
                <div class="mt-6 space-y-6">
                  <!-- Product Name -->
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">
                      Product Name *
                    </label>
                    <input
                      v-model="form.name"
                      type="text"
                      name="name"
                      id="name"
                      required
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      :class="{ 'border-red-300': errors.name }"
                      placeholder="Enter product name"
                    />
                    <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name[0] }}</p>
                  </div>

                  <!-- Description -->
                  <div>
                    <label for="description" class="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      v-model="form.description"
                      name="description"
                      id="description"
                      rows="3"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      :class="{ 'border-red-300': errors.description }"
                      placeholder="Enter product description"
                    ></textarea>
                    <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description[0] }}</p>
                  </div>

                  <!-- Price and Stock -->
                  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label for="price" class="block text-sm font-medium text-gray-700">
                        Price ($) *
                      </label>
                      <input
                        v-model.number="form.price"
                        type="number"
                        name="price"
                        id="price"
                        step="0.01"
                        min="0"
                        required
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        :class="{ 'border-red-300': errors.price }"
                        placeholder="0.00"
                      />
                      <p v-if="errors.price" class="mt-1 text-sm text-red-600">{{ errors.price[0] }}</p>
                    </div>

                    <div>
                      <label for="stock" class="block text-sm font-medium text-gray-700">
                        Stock Quantity *
                      </label>
                      <input
                        v-model.number="form.stock"
                        type="number"
                        name="stock"
                        id="stock"
                        min="0"
                        required
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        :class="{ 'border-red-300': errors.stock }"
                        placeholder="0"
                      />
                      <p v-if="errors.stock" class="mt-1 text-sm text-red-600">{{ errors.stock[0] }}</p>
                    </div>
                  </div>

                  <!-- Active Status -->
                  <div class="flex items-center">
                    <input
                      v-model="form.is_active"
                      id="is_active"
                      name="is_active"
                      type="checkbox"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label for="is_active" class="ml-2 block text-sm text-gray-900">
                      Product is active
                    </label>
                  </div>

                  <!-- General Error -->
                  <div v-if="generalError" class="rounded-md bg-red-50 p-4">
                    <div class="flex">
                      <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div class="ml-3">
                        <h3 class="text-sm font-medium text-red-800">
                          {{ generalError }}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              :disabled="loading"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product') }}
            </button>
            <button
              type="button"
              @click="$emit('close')"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { productsAPI, type Product, type ProductData } from '@/services/api'

interface Props {
  product?: Product | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

// State
const loading = ref(false)
const generalError = ref('')
const errors = ref<Record<string, string[]>>({})

const form = reactive<ProductData>({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  is_active: true
})

// Computed
const isEditing = computed(() => !!props.product)

// Methods
const resetForm = () => {
  if (props.product) {
    form.name = props.product.name
    form.description = props.product.description || ''
    form.price = parseFloat(props.product.price)
    form.stock = props.product.stock
    form.is_active = props.product.is_active
  } else {
    form.name = ''
    form.description = ''
    form.price = 0
    form.stock = 0
    form.is_active = true
  }
  errors.value = {}
  generalError.value = ''
}

const handleSubmit = async () => {
  loading.value = true
  errors.value = {}
  generalError.value = ''

  try {
    let response
    if (isEditing.value && props.product) {
      response = await productsAPI.updateProduct(props.product.id, form)
    } else {
      response = await productsAPI.createProduct(form)
    }

    if (response.success) {
      emit('saved')
    } else {
      generalError.value = response.message || 'Failed to save product'
    }
  } catch (error: any) {
    if (error.response?.status === 422 && error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      generalError.value = error.response?.data?.message || 'Failed to save product'
    }
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  resetForm()
})
</script>
