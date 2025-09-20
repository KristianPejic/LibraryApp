import { createApp } from 'vue'
import ToastContainer from '@/components/common/ToastContainer.vue'

class ToastService {
  constructor() {
    this.toasts = []
    this.container = null
    this.app = null
    this.init()
  }

  init() {
    // Create toast container
    const toastDiv = document.createElement('div')
    toastDiv.id = 'toast-container'
    document.body.appendChild(toastDiv)

    // Mount Vue app for toasts
    this.app = createApp(ToastContainer, {
      toasts: this.toasts
    })
    this.container = this.app.mount('#toast-container')
  }

  show(message, type = 'info', duration = 4000) {
    const id = Date.now() + Math.random()
    const toast = {
      id,
      message,
      type, // success, error, warning, info
      duration,
      visible: true
    }

    this.toasts.push(toast)
    this.container.$forceUpdate()

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(id)
      }, duration)
    }

    return id
  }

  remove(id) {
    const index = this.toasts.findIndex(toast => toast.id === id)
    if (index > -1) {
      this.toasts.splice(index, 1)
      this.container.$forceUpdate()
    }
  }

  success(message, duration = 4000) {
    return this.show(message, 'success', duration)
  }

  error(message, duration = 6000) {
    return this.show(message, 'error', duration)
  }

  warning(message, duration = 5000) {
    return this.show(message, 'warning', duration)
  }

  info(message, duration = 4000) {
    return this.show(message, 'info', duration)
  }

  clear() {
    this.toasts.length = 0
    this.container.$forceUpdate()
  }
}

// Create singleton instance
const toast = new ToastService()

// Vue plugin
export default {
  install(app) {
    app.config.globalProperties.$toast = toast
    app.provide('toast', toast)
  }
}

export { toast }

