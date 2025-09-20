<template>
  <v-card class="search-bar" elevation="2">
    <v-card-text class="pa-2">
      <v-text-field
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        placeholder="Search books, authors, genres..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="comfortable"
        hide-details
        clearable
        :loading="loading"
        @keyup.enter="handleSearch"
        @click:clear="handleClear"
      >
        <template v-slot:append>
          <v-btn
            color="primary"
            @click="handleSearch"
            :disabled="!modelValue || !modelValue.trim()"
            :loading="loading"
          >
            Search
          </v-btn>
        </template>
      </v-text-field>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'search', 'clear'],
  methods: {
    handleSearch() {
      this.$emit('search')
    },
    handleClear() {
      this.$emit('clear')
    }
  }
}
</script>
