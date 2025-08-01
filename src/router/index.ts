import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import AccommodationsView from '../views/AccommodationsView.vue'
import ClientsView from '../views/ClientsView.vue'
import BookingsView from '../views/BookingsView.vue'
import InventoryView from '../views/InventoryView.vue'
import CustomItemsView from '../views/CustomItemsView.vue'
import CalendarView from '../views/CalendarView.vue'
import MoreView from '../views/MoreView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        requiresGuest: true,
      },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/accommodations',
      name: 'accommodations',
      component: AccommodationsView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/clients',
      name: 'clients',
      component: ClientsView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/bookings',
      name: 'bookings',
      component: BookingsView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: InventoryView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/more',
      name: 'more',
      component: MoreView,
      meta: {
        requiresAuth: true,
      },
    },
    // Backward compatibility redirects
    {
      path: '/inventory-types',
      redirect: '/inventory',
    },
    {
      path: '/inventory-items',
      redirect: '/inventory',
    },
    {
      path: '/custom-items',
      name: 'custom-items',
      component: CustomItemsView,
      meta: {
        requiresAuth: true,
      },
    },
  ],
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    const isAuthenticated = await authStore.checkAuth()
    if (!isAuthenticated) {
      next('/login')
      return
    }
  }

  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest) {
    const isAuthenticated = await authStore.checkAuth()
    if (isAuthenticated) {
      next('/dashboard')
      return
    }
  }

  next()
})

export default router
