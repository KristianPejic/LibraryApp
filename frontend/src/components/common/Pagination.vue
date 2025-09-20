<template>
  <div class="pagination-wrapper">
    <!-- Mobile Pagination -->
    <div v-if="$vuetify.display.smAndDown" class="mobile-pagination">
      <v-btn
        @click="goToPrevious"
        :disabled="modelValue <= 1 || loading"
        variant="outlined"
        prepend-icon="mdi-chevron-left"
        class="me-2"
      >
        Previous
      </v-btn>

      <span class="page-info mx-4">
        Page {{ modelValue }} of {{ totalPages }}
      </span>

      <v-btn
        @click="goToNext"
        :disabled="modelValue >= totalPages || loading"
        variant="outlined"
        append-icon="mdi-chevron-right"
      >
        Next
      </v-btn>
    </div>

    <!-- Desktop Pagination -->
    <v-pagination
      v-else
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :length="totalPages"
      :disabled="loading"
      :total-visible="7"
      class="desktop-pagination"
    ></v-pagination>

    <!-- Page Size Selector -->
    <div v-if="showPageSize" class="page-size-selector mt-4 text-center">
      <span class="text-body-2 me-2">Items per page:</span>
      <v-select
        :model-value="pageSize"
        @update:model-value="$emit('update:pageSize', $event)"
        :items="pageSizeOptions"
        variant="outlined"
        density="compact"
        style="width: 80px; display: inline-block;"
        hide-details
      ></v-select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    modelValue: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    pageSize: {
      type: Number,
      default: 20
    },
    showPageSize: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'update:pageSize'],
  data() {
    return {
      pageSizeOptions: [10, 20, 50]
    }
  },
  methods: {
    goToPrevious() {
      if (this.modelValue > 1) {
        this.$emit('update:modelValue', this.modelValue - 1)
      }
    },
    goToNext() {
      if (this.modelValue < this.totalPages) {
        this.$emit('update:modelValue', this.modelValue + 1)
      }
    }
  }
}
</script>

<style scoped>
.pagination-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.mobile-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-info {
  font-weight: 500;
  white-space: nowrap;
}

.page-size-selector {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
