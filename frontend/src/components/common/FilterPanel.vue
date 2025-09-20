<template>
  <v-card class="filter-panel" elevation="1">
    <v-card-title class="d-flex align-center">
      <v-icon icon="mdi-filter" class="me-2"></v-icon>
      Filters

      <v-spacer></v-spacer>

      <v-btn
        @click="clearAll"
        variant="text"
        size="small"
        :disabled="!hasActiveFilters"
      >
        Clear All
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-row>
        <!-- Author Filter -->
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            :model-value="author"
            @update:model-value="$emit('update:author', $event)"
            label="Author"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            prepend-inner-icon="mdi-account"
          ></v-text-field>
        </v-col>

        <!-- Subject/Genre Filter -->
        <v-col cols="12" sm="6" md="3">
          <v-select
            :model-value="subject"
            @update:model-value="$emit('update:subject', $event)"
            :items="subjectOptions"
            label="Genre/Subject"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            prepend-inner-icon="mdi-tag"
          ></v-select>
        </v-col>

        <!-- Language Filter -->
        <v-col cols="12" sm="6" md="3">
          <v-select
            :model-value="language"
            @update:model-value="$emit('update:language', $event)"
            :items="languageOptions"
            label="Language"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            prepend-inner-icon="mdi-translate"
          ></v-select>
        </v-col>

        <!-- Year Range -->
        <v-col cols="12" sm="6" md="3">
          <div class="d-flex ga-2">
            <v-text-field
              :model-value="yearFrom"
              @update:model-value="$emit('update:yearFrom', $event ? parseInt($event) : null)"
              label="From Year"
              variant="outlined"
              density="compact"
              hide-details
              type="number"
              :min="1800"
              :max="currentYear"
            ></v-text-field>

            <v-text-field
              :model-value="yearTo"
              @update:model-value="$emit('update:yearTo', $event ? parseInt($event) : null)"
              label="To Year"
              variant="outlined"
              density="compact"
              hide-details
              type="number"
              :min="1800"
              :max="currentYear"
            ></v-text-field>
          </div>
        </v-col>
      </v-row>

      <!-- Apply Button -->
      <div class="text-center mt-4">
        <v-btn
          @click="$emit('apply')"
          color="primary"
          :loading="loading"
          prepend-icon="mdi-filter-check"
        >
          Apply Filters
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'FilterPanel',
  props: {
    author: {
      type: String,
      default: ''
    },
    subject: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      default: ''
    },
    yearFrom: {
      type: Number,
      default: null
    },
    yearTo: {
      type: Number,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'update:author',
    'update:subject',
    'update:language',
    'update:yearFrom',
    'update:yearTo',
    'apply',
    'clear'
  ],
  data() {
    return {
      subjectOptions: [
        'fiction',
        'romance',
        'mystery',
        'science fiction',
        'fantasy',
        'thriller',
        'biography',
        'history',
        'poetry',
        'drama',
        'horror',
        'adventure',
        'comedy',
        'philosophy',
        'religion',
        'politics',
        'science',
        'technology',
        'travel',
        'cooking'
      ],
      languageOptions: [
        { title: 'English', value: 'eng' },
        { title: 'Spanish', value: 'spa' },
        { title: 'French', value: 'fre' },
        { title: 'German', value: 'ger' },
        { title: 'Italian', value: 'ita' },
        { title: 'Portuguese', value: 'por' },
        { title: 'Russian', value: 'rus' },
        { title: 'Chinese', value: 'chi' },
        { title: 'Japanese', value: 'jpn' },
        { title: 'Arabic', value: 'ara' }
      ]
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear()
    },
    hasActiveFilters() {
      return !!(this.author || this.subject || this.language || this.yearFrom || this.yearTo)
    }
  },
  methods: {
    clearAll() {
      this.$emit('update:author', '')
      this.$emit('update:subject', '')
      this.$emit('update:language', '')
      this.$emit('update:yearFrom', null)
      this.$emit('update:yearTo', null)
      this.$emit('clear')
    }
  }
}
</script>

<style scoped>
.filter-panel {
  border: 1px solid #e0e0e0;
}
</style>
