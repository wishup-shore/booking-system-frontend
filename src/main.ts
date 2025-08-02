/**
 * Main Application Entry Point
 * Professional Accommodation Management System
 */

import { createApp } from 'vue'
import App from './App.vue'

// Import professional design system styles
import './styles/professional.css'

// Initialize professional interface
import { professionalInterface } from './utils/professionalInterface'

const app = createApp(App)

// Initialize professional interface on app startup
professionalInterface.setMode('quiet')

app.mount('#app')