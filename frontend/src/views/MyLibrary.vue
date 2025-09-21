<template>
  <div class="my-library-page">
    <v-container>
      <!-- Page Header -->
      <div class="page-header py-6">
        <div class="d-flex justify-space-between align-center flex-wrap">
          <div>
            <h1 class="text-h3 font-weight-bold mb-2">My Library</h1>
            <p class="text-h6 text-grey-darken-1">
              Manage your personal book collection and reading lists
            </p>
          </div>

          <!-- Add Book Button -->
          <v-btn
            @click="openAddDialog()"
            color="primary"
            prepend-icon="mdi-plus"
            size="large"
          >
            Add Custom Book
          </v-btn>
        </div>
      </div>

      <!-- Library Stats -->
      <v-row class="mb-6">
        <v-col
          v-for="stat in libraryStats"
          :key="stat.title"
          cols="6"
          sm="3"
        >
          <v-card class="text-center pa-4" elevation="2">
            <v-icon
              :icon="stat.icon"
              :color="stat.color"
              size="32"
              class="mb-2"
            ></v-icon>
            <h3 class="text-h5 font-weight-bold">{{ stat.count }}</h3>
            <p class="text-body-2 text-grey-darken-1">{{ stat.title }}</p>
          </v-card>
        </v-col>
      </v-row>

      <!-- Reading Lists Tabs -->
      <v-card class="mb-6">
        <v-tabs
          v-model="activeTab"
          bg-color="primary"
          color="white"
          grow
        >
          <v-tab value="all">
            <v-icon icon="mdi-book-multiple" class="me-2"></v-icon>
            All Books ({{ allBooks.length }})
          </v-tab>

          <v-tab value="want-to-read">
            <v-icon icon="mdi-bookmark-outline" class="me-2"></v-icon>
            Want to Read ({{ wantToReadBooks.length }})
          </v-tab>

          <v-tab value="currently-reading">
            <v-icon icon="mdi-book-open-variant" class="me-2"></v-icon>
            Currently Reading ({{ currentlyReadingBooks.length }})
          </v-tab>

          <v-tab value="read">
            <v-icon icon="mdi-check-circle" class="me-2"></v-icon>
            Read ({{ readBooks.length }})
          </v-tab>

          <v-tab value="custom">
            <v-icon icon="mdi-plus-circle" class="me-2"></v-icon>
            Custom Books ({{ customBooks.length }})
          </v-tab>
        </v-tabs>

        <v-tabs-window v-model="activeTab">
          <!-- All Books Tab -->
          <v-tabs-window-item value="all">
            <LibraryBooksList
              :books="allBooks"
              :loading="loading"
              @update-status="updateBookStatus"
              @remove-book="removeBook"
              @edit-book="editBook"
              title="All Books in Your Library"
            />
          </v-tabs-window-item>

          <!-- Want to Read Tab -->
          <v-tabs-window-item value="want-to-read">
            <LibraryBooksList
              :books="wantToReadBooks"
              :loading="loading"
              @update-status="updateBookStatus"
              @remove-book="removeBook"
              @edit-book="editBook"
              title="Books You Want to Read"
              empty-message="No books in your 'Want to Read' list yet. Start adding some books!"
            />
          </v-tabs-window-item>

          <!-- Currently Reading Tab -->
          <v-tabs-window-item value="currently-reading">
            <LibraryBooksList
              :books="currentlyReadingBooks"
              :loading="loading"
              @update-status="updateBookStatus"
              @remove-book="removeBook"
              @edit-book="editBook"
              title="Books You're Currently Reading"
              empty-message="No books currently being read. Start a new book today!"
            />
          </v-tabs-window-item>

          <!-- Read Tab -->
          <v-tabs-window-item value="read">
            <LibraryBooksList
              :books="readBooks"
              :loading="loading"
              @update-status="updateBookStatus"
              @remove-book="removeBook"
              @edit-book="editBook"
              title="Books You've Read"
              empty-message="No completed books yet. Finish reading a book to see it here!"
            />
          </v-tabs-window-item>

          <!-- Custom Books Tab -->
          <v-tabs-window-item value="custom">
            <LibraryBooksList
              :books="customBooks"
              :loading="loading"
              @update-status="updateBookStatus"
              @remove-book="removeBook"
              @edit-book="editBook"
              title="Your Custom Books"
              empty-message="No custom books added. Add books that aren't in our database!"
              :show-edit="true"
            />
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card>

      <!-- Add/Edit Book Dialog -->
      <v-dialog
        v-model="showAddBookDialog"
        max-width="600"
        persistent
      >
        <BookForm
          :book="editingBook"
          :loading="saving"
          @save="saveBook"
          @cancel="cancelBookForm"
        />
      </v-dialog>

      <!-- Confirmation Dialog -->
      <v-dialog
        v-model="showConfirmDialog"
        max-width="400"
      >
        <v-card>
          <v-card-title class="text-h6">
            {{ confirmDialog.title }}
          </v-card-title>

          <v-card-text>
            {{ confirmDialog.message }}
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="showConfirmDialog = false">
              Cancel
            </v-btn>
            <v-btn
              @click="executeConfirmAction"
              :color="confirmDialog.color"
              variant="elevated"
            >
              {{ confirmDialog.confirmText }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Snackbar Feedback -->
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
        {{ snackbar.text }}
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
import LibraryBooksList from '@/components/common/LibraryBooksList.vue'
import BookForm from '@/components/forms/BookForm.vue'
import {
  getAllBooks,
  createCustomBook,
  updateBook as updateBookService,
  removeBook as removeBookService,
  getLibraryStats
} from '@/services/customBooksService'

export default {
  name: 'MyLibrary',
  components: {
    LibraryBooksList,
    BookForm
  },
  data() {
    return {
      // UI State
      activeTab: 'all',
      loading: false,
      saving: false,

      // Books Data
      userLibrary: [],

      // Dialog State
      showAddBookDialog: false,
      showConfirmDialog: false,
      editingBook: null,

      // Feedback
      snackbar: {
        show: false,
        text: '',
        color: 'success'
      },

      // Library Statistics
      stats: {
        total: 0,
        wantToRead: 0,
        currentlyReading: 0,
        read: 0,
        custom: 0
      },

      // Confirmation Dialog
      confirmDialog: {
        title: '',
        message: '',
        action: null,
        color: 'error',
        confirmText: 'Delete'
      }
    }
  },

  computed: {
    // Library Statistics
    libraryStats() {
      return [
        {
          title: 'Total Books',
          count: this.stats.total,
          icon: 'mdi-book-multiple',
          color: 'primary'
        },
        {
          title: 'Want to Read',
          count: this.stats.wantToRead,
          icon: 'mdi-bookmark-outline',
          color: 'orange'
        },
        {
          title: 'Currently Reading',
          count: this.stats.currentlyReading,
          icon: 'mdi-book-open-variant',
          color: 'blue'
        },
        {
          title: 'Completed',
          count: this.stats.read,
          icon: 'mdi-check-circle',
          color: 'success'
        }
      ]
    },

    // Filtered Book Lists
    allBooks() {
      return this.userLibrary
    },

    wantToReadBooks() {
      return this.userLibrary.filter(book => book.status === 'want-to-read')
    },

    currentlyReadingBooks() {
      return this.userLibrary.filter(book => book.status === 'currently-reading')
    },

    readBooks() {
      return this.userLibrary.filter(book => book.status === 'read')
    },

    customBooks() {
      return this.userLibrary.filter(book => book.isCustom === true || book.is_custom === true)
    }
  },

  async mounted() {
    await this.loadUserLibrary()
    await this.loadLibraryStats()
  },

  methods: {
    // Load user library from both API and localStorage
    async loadUserLibrary() {
      this.loading = true
      try {
        const result = await getAllBooks()
        if (result.success) {
          this.userLibrary = result.books.map(book => ({
            ...book,
            status: book.status || 'want-to-read',
            addedDate: book.addedDate || book.created_date || new Date().toISOString(),
            isCustom: book.isCustom || book.is_custom || false
          }))
        } else {
          throw new Error('Failed to load library')
        }
      } catch (error) {
        console.error('Error loading user library:', error)
        this.showErrorMessage('Failed to load your library: ' + (error.message || 'Unknown error'))
      } finally {
        this.loading = false
      }
    },

    // Load library statistics
    async loadLibraryStats() {
      try {
        this.stats = await getLibraryStats()
      } catch (error) {
        console.error('Error loading library stats:', error)
      }
    },

    openAddDialog() {
      this.editingBook = null
      this.showAddBookDialog = true
    },

    // Save book (Create/Update)
    async saveBook(bookData) {
      this.saving = true
      try {
        if (this.editingBook && this.editingBook.id) {
          // Update existing book
          const result = await updateBookService(this.editingBook, bookData)
          if (result.success) {
            await this.loadUserLibrary()
            await this.loadLibraryStats()
            this.showSuccessMessage('Book updated successfully!')
          } else {
            throw new Error(result.error || 'Failed to update book')
          }
        } else {
          // Create a new custom book
          const result = await createCustomBook(bookData)
          if (result.success) {
            await this.loadUserLibrary()
            await this.loadLibraryStats()
            this.showSuccessMessage('Custom book added successfully!')
          } else {
            throw new Error(result.error || 'Failed to create book')
          }
        }

        // Close form
        this.showAddBookDialog = false
        this.editingBook = null
      } catch (error) {
        console.error('Error saving book:', error)
        this.showErrorMessage(error.message || 'Failed to save book')
      } finally {
        this.saving = false
      }
    },

    cancelBookForm() {
      this.showAddBookDialog = false
      this.editingBook = null
    },

    editBook(book) {
      this.editingBook = { ...book }
      this.showAddBookDialog = true
    },

    async updateBookStatus(book, newStatus) {
      try {
        if (!book?.id) return
        const result = await updateBookService(book, { status: newStatus })
        if (result.success) {
          // Update local state optimistically for responsiveness
          const idx = this.userLibrary.findIndex(b => b.id === book.id)
          if (idx !== -1) {
            this.$set
              ? this.$set(this.userLibrary, idx, { ...this.userLibrary[idx], status: newStatus })
              : (this.userLibrary[idx] = { ...this.userLibrary[idx], status: newStatus })
          }
          await this.loadLibraryStats()
          this.showSuccessMessage('Status updated')
        } else {
          throw new Error(result.error || 'Failed to update status')
        }
      } catch (error) {
        console.error('Error updating status:', error)
        this.showErrorMessage(error.message || 'Failed to update status')
      }
    },

    removeBook(book) {
      if (!book?.id) return

      // Prepare confirmation dialog
      this.confirmDialog = {
        title: 'Remove Book',
        message: `Are you sure you want to remove "${book.title}" from your library?`,
        color: 'error',
        confirmText: 'Remove',
        action: async () => {
          try {
            const res = await removeBookService(book)
            if (res.success) {
              await this.loadUserLibrary()
              await this.loadLibraryStats()
              this.showSuccessMessage('Book removed')
            } else {
              throw new Error(res.error || 'Failed to remove book')
            }
          } catch (error) {
            console.error('Error removing book:', error)
            this.showErrorMessage(error.message || 'Failed to remove book')
          } finally {
            this.showConfirmDialog = false
          }
        }
      }

      this.showConfirmDialog = true
    },

    async executeConfirmAction() {
      // Ensure action exists and is a function
      if (typeof this.confirmDialog.action === 'function') {
        await this.confirmDialog.action()
      } else {
        this.showConfirmDialog = false
      }
    },

    showSuccessMessage(text) {
      this.snackbar = { show: true, text, color: 'success' }
    },

    showErrorMessage(text) {
      this.snackbar = { show: true, text, color: 'error' }
    }
  }
}
</script>

<style scoped>
.my-library-page {
  min-height: 70vh;
}

.page-header {
  border-bottom: 1px solid rgba(0,0,0,0.06);
}
</style>
