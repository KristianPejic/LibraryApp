<template>
  <teleport to="body">
    <div class="toast-container">
      <transition-group name="toast" tag="div">
        <div
          v-for="toast in visibleToasts"
          :key="toast.id"
          :class="toastClasses(toast)"
          class="toast-item"
        >
          <v-alert
            :type="toast.type"
            variant="elevated"
            closable
            elevation="6"
            @click:close="removeToast(toast.id)"
          >
            <template v-slot:prepend>
              <v-icon :icon="getIcon(toast.type)"></v-icon>
            </template>

            {{ toast.message }}
          </v-alert>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script>
export default {
  name: 'ToastContainer',
  props: {
    toasts: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    visibleToasts() {
      return this.toasts.filter(toast => toast.visible)
    }
  },
  methods: {
    toastClasses(toast) {
      return {
        [`toast-${toast.type}`]: true
      }
    },

    getIcon(type) {
      const icons = {
        success: 'mdi-check-circle',
        error: 'mdi-alert-circle',
        warning: 'mdi-alert',
        info: 'mdi-information'
      }
      return icons[type] || 'mdi-information'
    },

    removeToast(id) {
      const toast = this.toasts.find(t => t.id === id)
      if (toast) {
        toast.visible = false
        setTimeout(() => {
          const index = this.toasts.findIndex(t => t.id === id)
          if (index > -1) {
            this.toasts.splice(index, 1)
          }
        }, 300)
      }
    }
  }
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
  pointer-events: none;
}

.toast-item {
  margin-bottom: 12px;
  pointer-events: all;
}

/* Toast transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}

/* Mobile adjustments */
@media (max-width: 600px) {
  .toast-container {
    right: 10px;
    left: 10px;
    max-width: none;
  }

  .toast-item {
    margin-bottom: 8px;
  }
}
</style>
