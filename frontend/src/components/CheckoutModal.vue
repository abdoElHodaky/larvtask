<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-medium text-gray-900">Checkout</h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Order Summary -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 class="text-sm font-medium text-gray-900 mb-2">Order Summary</h4>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Items ({{ cartItemsCount }})</span>
            <span class="text-gray-900">${{ cartTotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-lg font-semibold mt-2 pt-2 border-t border-gray-200">
            <span class="text-gray-900">Total</span>
            <span class="text-gray-900">${{ cartTotal.toFixed(2) }}</span>
          </div>
        </div>

        <!-- Error Message -->
        <AlertMessage 
          v-if="error" 
          type="error" 
          :message="error" 
          class="mb-6"
          @close="error = ''"
        />

        <!-- Checkout Form -->
        <form @submit.prevent="submitOrder" class="space-y-6">
          <div>
            <label for="address" class="block text-sm font-medium text-gray-700">
              Delivery Address *
            </label>
            <textarea
              id="address"
              v-model="form.address"
              rows="3"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              :class="{ 'border-red-300': errors.address }"
              placeholder="Enter your full delivery address"
            ></textarea>
            <p v-if="errors.address" class="mt-1 text-sm text-red-600">{{ errors.address }}</p>
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              :class="{ 'border-red-300': errors.phone }"
              placeholder="Enter your phone number"
            />
            <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="flex-1 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :disabled="loading"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="loading || !isFormValid"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <LoadingSpinner size="sm" class="mr-2" />
                Processing...
              </span>
              <span v-else>
                Place Order (${{ cartTotal.toFixed(2) }})
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import AlertMessage from '@/components/AlertMessage.vue'

interface Props {
  cartTotal: number
  cartItemsCount: number
}

interface Emits {
  (e: 'close'): void
  (e: 'order-created', orderData: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const cartStore = useCartStore()
const loading = ref(false)
const error = ref('')

const form = ref({
  address: '',
  phone: ''
})

const errors = ref({
  address: '',
  phone: ''
})

const isFormValid = computed(() => {
  return form.value.address.trim().length > 0 && 
         form.value.phone.trim().length > 0 &&
         !errors.value.address &&
         !errors.value.phone
})

const validateForm = () => {
  errors.value = {
    address: '',
    phone: ''
  }

  if (!form.value.address.trim()) {
    errors.value.address = 'Address is required'
  } else if (form.value.address.trim().length < 10) {
    errors.value.address = 'Address must be at least 10 characters long'
  }

  if (!form.value.phone.trim()) {
    errors.value.phone = 'Phone number is required'
  } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(form.value.phone.replace(/[\s\-\(\)]/g, ''))) {
    errors.value.phone = 'Please enter a valid phone number'
  }

  return !errors.value.address && !errors.value.phone
}

const submitOrder = async () => {
  if (!validateForm()) {
    return
  }

  try {
    loading.value = true
    error.value = ''

    const result = await cartStore.createOrderFromCart({
      address: form.value.address.trim(),
      phone: form.value.phone.trim()
    })

    if (result.success) {
      emit('order-created', result.data)
    } else {
      error.value = result.message
    }
  } catch (err: any) {
    console.error('Error creating order:', err)
    error.value = err.response?.data?.message || 'Failed to create order'
  } finally {
    loading.value = false
  }
}
</script>
