<template>
  <div class="flex justify-center items-center" :class="containerClass">
    <div class="animate-spin rounded-full border-b-2 border-indigo-600" :class="spinnerClass"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  containerClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  containerClass: 'py-4'
})

const spinnerClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-4 w-4'
    case 'lg':
      return 'h-12 w-12'
    default:
      return 'h-8 w-8'
  }
})
</script>

<script lang="ts">
import { computed } from 'vue'
export default {
  name: 'LoadingSpinner'
}
</script>
