<template>
  <v-card class="library-book-card" elevation="2">
    <!-- Book Cover -->
    <v-img
      :src="book.coverUrl || '/placeholder-book.jpg'"
      :alt="`Cover of ${book.title}`"
      aspect-ratio="0.67"
      cover
    >
      <template v-slot:error>
        <div class="d-flex align-center justify-center fill-height bg-grey-lighten-3">
          <v-icon icon="mdi-book" size="32" color="grey-darken-1"></v-icon>
        </div>
      </template>

      <!-- Status Badge -->
      <v-chip
        :color="statusColor"
        size="small"
        class="status-badge"
        variant="elevated"
      >
        {{ statusLabel }}
      </v-chip>
    </v-img>

    <!-- Book Info -->
    <v-card-text class="pa-3">
      <h4 class="text-subtitle-1 font-weight-medium mb-1 book-title">
        {{ truncatedTitle }}
      </h4>

      <p class="text-body-2 text-grey-darken-1 mb-2 book-authors">
        {{ formatAuthors(book.authors) }}
      </p>

      <div v-if="book.publishYear" class="text-caption text-grey-darken-2 mb-2">
        Published: {{ book.publishYear }}
      </div>

      <div v-if="book.addedDate" class="text-caption text-grey-darken-2 mb-3">
        Added: {{ formatDate(book.addedDate) }}
      </div>

      <!-- Status Selector -->
      <v-select
        :model-value="book.status"
        @update:model-value="handleStatusUpdate"
        :items="statusOptions"
        variant="outlined"
        density="compact"
        hide-details
        class="mb-2"
      ></v-select>
    </v-card-text>

    <!-- Actions -->
    <v-card-actions class="pt-0 px-3 pb-3">
      <v-btn
        v-if="showEdit"
        @click="handleEditBook"
        variant="text"
        size="small"
        prepend-icon="mdi-pencil"
        color="primary"
      >
        Edit
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn
        @click="handleRemoveBook"
        variant="text"
        size="small"
        prepend-icon="mdi-delete"
        color="error"
      >
        Remove
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { formatBookAuthors, truncateText } from '@/services/bookService'

export default {
  name: 'LibraryBookCard',
  props: {
    book: {
      type: Object,
      required: true
    },
    showEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update-status', 'remove-book', 'edit-book'],

  computed: {
    truncatedTitle() {
      return this.book.title ? truncateText(this.book.title, 50) : 'Untitled'
    },

    statusLabel() {
      const labels = {
        'want-to-read': 'Want to Read',
        'currently-reading': 'Reading',
        'read': 'Read'
      }
      return labels[this.book.status] || this.book.status
    },

    statusColor() {
      const colors = {
        'want-to-read': 'orange',
        'currently-reading': 'blue',
        'read': 'success'
      }
      return colors[this.book.status] || 'grey'
    },

    statusOptions() {
      return [
        { title: 'Want to Read', value: 'want-to-read' },
        { title: 'Currently Reading', value: 'currently-reading' },
        { title: 'Read', value: 'read' }
      ]
    }
  },

  methods: {
    // FIXED: Move handleRemoveBook to methods (was in computed!)
    handleRemoveBook() {
      console.log('LibraryBookCard: Remove button clicked for book:', this.book.title)
      this.$emit('remove-book')
    },

    handleEditBook() {
      console.log('LibraryBookCard: Edit button clicked for book:', this.book.title)
      this.$emit('edit-book')
    },

    handleStatusUpdate(newStatus) {
      console.log('LibraryBookCard: Status update for', this.book.title, ':', newStatus)
      this.$emit('update-status', newStatus)
    },

    formatAuthors(authors) {
      return formatBookAuthors(authors)
    },

    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString()
    }
  }
}
</script>

<style scoped>
.library-book-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.status-badge {
  position: absolute;
  top: 8px;
  right: 8px;
}

.book-title {
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-authors {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Mobile optimizations */
@media (max-width: 600px) {
  .v-card-text {
    padding: 8px !important;
  }

  .v-card-actions {
    padding: 0 8px 8px !important;
  }

  .book-title {
    font-size: 0.875rem;
  }

  .book-authors {
    font-size: 0.75rem;
  }
}
</style>
