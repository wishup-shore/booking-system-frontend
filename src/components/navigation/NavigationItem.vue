<template>
  <router-link
    :to="item.route"
    v-slot="{ href, navigate, isActive, isExactActive }"
    custom
  >
    <button
      @click="navigate"
      :class="[
        'relative flex flex-col items-center justify-center touch-target tap-highlight-none transition-all duration-200 ease-in-out group',
        'px-1 py-2 min-h-[60px] min-w-[44px]',
        isActive || isExactActive
          ? 'text-primary-600'
          : 'text-gray-400 hover:text-gray-600 active:text-gray-700'
      ]"
      :aria-label="`Navigate to ${item.name}`"
      :aria-current="isActive || isExactActive ? 'page' : undefined"
      type="button"
    >
      <!-- Icon Container -->
      <div
        :class="[
          'relative flex items-center justify-center w-6 h-6 mb-1 transition-transform duration-200 ease-in-out',
          'group-active:scale-95'
        ]"
      >
        <!-- Dynamic Icon Component -->
        <component
          :is="iconComponent"
          :class="[
            'w-6 h-6 transition-colors duration-200 ease-in-out',
            isActive || isExactActive
              ? 'text-primary-600'
              : 'text-current'
          ]"
          :stroke-width="isActive || isExactActive ? 2.5 : 2"
        />
        
        <!-- Badge -->
        <span
          v-if="item.badge && item.badge > 0"
          :class="[
            'absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1',
            'text-xs font-medium text-white bg-error-500 rounded-full border-2 border-white',
            'transition-transform duration-200 ease-in-out group-active:scale-90'
          ]"
          :aria-label="`${item.badge} notification${item.badge > 1 ? 's' : ''}`"
        >
          {{ item.badge > 99 ? '99+' : item.badge }}
        </span>
      </div>

      <!-- Label -->
      <span
        :class="[
          'text-xs font-medium leading-tight text-center transition-colors duration-200 ease-in-out',
          'max-w-full truncate',
          isActive || isExactActive
            ? 'text-primary-600'
            : 'text-current'
        ]"
      >
        {{ item.name }}
      </span>

      <!-- Active Indicator -->
      <div
        v-if="isActive || isExactActive"
        class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full"
        aria-hidden="true"
      />
    </button>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { NavigationItem } from '@/types/mobile'
import { 
  HomeIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  EllipsisHorizontalIcon,
  BuildingOfficeIcon,
  CubeIcon
} from '@heroicons/vue/24/outline'

interface Props {
  item: NavigationItem
}

const props = defineProps<Props>()

// Icon mapping - maps icon names to actual Heroicon components
const iconMap = {
  HomeIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  EllipsisHorizontalIcon,
  BuildingOfficeIcon,
  CubeIcon
} as const

// Get the appropriate icon component
const iconComponent = computed(() => {
  const iconName = props.item.icon as keyof typeof iconMap
  return iconMap[iconName] || HomeIcon // fallback to HomeIcon
})
</script>

<style scoped>
/* Enhanced touch feedback */
@media (hover: none) {
  button:active {
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 12px;
  }
}

/* Ensure proper text rendering */
span {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Badge animation */
.badge-enter-active,
.badge-leave-active {
  transition: all 0.2s ease-in-out;
}

.badge-enter-from,
.badge-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>