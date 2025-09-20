<template>
  <div class="library-books-list pa-4">
    <!-- List Header -->
    <div class="d-flex justify-space-between align-center mb-4">
      <h3 class="text-h6">{{ title }}</h3>

      <!-- View Toggle -->
      <div class="d-flex align-center ga-2">
        <v-btn-toggle v-model="viewMode" mandatory>
          <v-btn icon="mdi-view-grid" size="small"></v-btn>
          <v-btn icon="mdi-format-list-bulleted" size="small"></v-btn>
        </v-btn-toggle>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
      <p class="text-body-2 mt-2">Loading your books...</p>
    </div>

    <!-- Books Grid View -->
    <v-row v-else-if="books.length > 0 && viewMode === 0">
      <v-col
        v-for="book in books"
        :key="book.id"
        cols="6"
        sm="4"
        md="3"
        lg="2"
      >
        <LibraryBookCard
          :book="book"
          :show-edit="showEdit"
          @update-status="handleUpdateStatus(book, $event)"
          @remove-book="handleRemoveBook(book)"
          @edit-book="handleEditBook(book)"
        />
      </v-col>
    </v-row>

    <!-- Books List View -->
    <v-list v-else-if="books.length > 0 && viewMode === 1" class="bg-transparent">
      <v-list-item
        v-for="book in books"
        :key="book.id"
        class="mb-2"
      >
        <template v-slot:prepend>
          <v-avatar size="64" class="me-4">
            <v-img
              :src="book.coverUrl || '/placeholder-book.jpg'"
              :alt="`Cover of ${book.title}`"
              cover
            >
              <template v-slot:error>
                <v-icon icon="mdi-book" size="32" color="grey"></v-icon>
              </template>
            </v-img>
          </v-avatar>
        </template>

        <v-list-item-title class="text-h6 mb-1">
          {{ book.title }}
        </v-list-item-title>

        <v-list-item-subtitle class="mb-2">
          <div>{{ formatAuthors(book.authors) }}</div>
          <div v-if="book.publishYear" class="text-caption">
            Published: {{ book.publishYear }}
          </div>
          <div v-if="book.addedDate" class="text-caption">
            Added: {{ formatDate(book.addedDate) }}
          </div>
        </v-list-item-subtitle>

        <template v-slot:append>
          <div class="d-flex flex-column ga-1">
            <!-- Status Selector -->
            <v-select
              :model-value="book.status"
              @update:model-value="handleUpdateStatus(book, $event)"
              :items="statusOptions"
              variant="outlined"
              density="compact"
              style="min-width: 160px;"
              hide-details
            ></v-select>

            <!-- Action Buttons -->
            <div class="d-flex ga-1">
              <v-btn
                v-if="showEdit"
                @click="handleEditBook(book)"
                icon="mdi-pencil"
                size="small"
                variant="text"
                color="primary"
              ></v-btn>

              <v-btn
                @click="handleRemoveBook(book)"
                icon="mdi-delete"
                size="small"
                variant="text"
                color="error"
              ></v-btn>
            </div>
          </div>
        </template>
      </v-list-item>
    </v-list>

    <!-- Empty State -->
    <div v-else class="empty-state text-center py-12">
      <v-icon
        icon="mdi-book-outline"
        size="64"
        color="grey-lighten-2"
        class="mb-4"
      ></v-icon>

      <h4 class="text-h6 mb-2">{{ emptyMessage }}</h4>

      <v-btn
        to="/books"
        color="primary"
        variant="outlined"
        prepend-icon="mdi-magnify"
      >
        Browse Books
      </v-btn>
    </div>
  </div>
</template>

<script>
import LibraryBookCard from './LibraryBookCard.vue'
import { formatBookAuthors } from '@/services/bookService'

export default {
  name: 'LibraryBooksList',
  components: {
    LibraryBookCard
  },
  props: {
    books: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Your Books'
    },
    emptyMessage: {
      type: String,
      default: 'No books in this list yet.'
    },
    showEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update-status', 'remove-book', 'edit-book'],
  data() {
    return {
      viewMode: 0, // 0 = grid, 1 = list
      statusOptions: [
        { title: 'Want to Read', value: 'want-to-read' },
        { title: 'Currently Reading', value: 'currently-reading' },
        { title: 'Read', value: 'read' }
      ]
    }
  },
  methods: {
    // Fixed: Add explicit event handlers with debug logging
    handleUpdateStatus(book, newStatus) {
      console.log('LibraryBooksList: Status update for', book.title, ':', newStatus)
      this.$emit('update-status', book, newStatus)
    },

    handleRemoveBook(book) {
      console.log('LibraryBooksList: Remove book clicked for', book.title)
      this.$emit('remove-book', book)
    },

    handleEditBook(book) {
      console.log('LibraryBooksList: Edit book clicked for', book.title)
      this.$emit('edit-book', book)
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
.library-books-list {
  min-height: 200px;
}

.empty-state {
  max-width: 400px;
  margin: 0 auto;
}
</style>
