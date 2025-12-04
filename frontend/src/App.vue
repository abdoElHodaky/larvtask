<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppLayout from './components/AppLayout.vue'
import { useAuthStore } from '@/stores/counter'

const route = useRoute()
const authStore = useAuthStore()

// Routes that don't need the layout (login, register)
const noLayoutRoutes = ['login', 'register']
const showLayout = computed(() => 
  !noLayoutRoutes.includes(route.name as string) && authStore.isAuthenticated
)
</script>

<template>
  <div id="app">
    <AppLayout v-if="showLayout">
      <RouterView />
    </AppLayout>
    <RouterView v-else />
  </div>
</template>

<style>
/* Global styles are handled by Tailwind CSS */
</style>
