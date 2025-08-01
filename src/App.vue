<template>
  <div id="app">
    <!-- Mobile Layout for mobile screens -->
    <MobileLayout v-if="isMobile && isAuthenticated">
      <RouterView />
    </MobileLayout>
    
    <!-- Default layout for desktop or unauthenticated users -->
    <RouterView v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useResponsive } from './composables/useResponsive'
import MobileLayout from './layouts/MobileLayout.vue'

// Composables
const route = useRoute()
const authStore = useAuthStore()
const { isMobile } = useResponsive()

// Check if user is authenticated and not on login page
const isAuthenticated = computed(() => {
  return authStore.isAuthenticated && route.name !== 'login'
})
</script>
