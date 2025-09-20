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
            @click="showAddBookDialog = true"
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
              @click="confirmDialog.action"
              :color="confirmDialog.color"
              variant="elevated"
            >
              {{ confirmDialog.confirmText }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import LibraryBooksList from '@/components/common/LibraryBooksList.vue'
import BookForm from '@/components/forms/BookForm.vue'

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
          count: this.allBooks.length,
          icon: 'mdi-book-multiple',
          color: 'primary'
        },
        {
          title: 'Want to Read',
          count: this.wantToReadBooks.length,
          icon: 'mdi-bookmark-outline',
          color: 'orange'
        },
        {
          title: 'Currently Reading',
          count: this.currentlyReadingBooks.length,
          icon: 'mdi-book-open-variant',
          color: 'blue'
        },
        {
          title: 'Completed',
          count: this.readBooks.length,
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
      return this.userLibrary.filter(book => book.isCustom === true)
    }
  },

  async mounted() {
    await this.loadUserLibrary()
  },

  methods: {
    // Load user library from localStorage
    async loadUserLibrary() {
      this.loading = true
      try {
        const saved = localStorage.getItem('userLibrary')
        if (saved) {
          this.userLibrary = JSON.parse(saved)

          // Add default status if missing
          this.userLibrary = this.userLibrary.map(book => ({
            ...book,
            status: book.status || 'want-to-read',
            addedDate: book.addedDate || new Date().toISOString(),
            isCustom: book.isCustom || false
          }))

          this.saveUserLibrary()
        }
      } catch (error) {
        console.error('Error loading user library:', error)
      } finally {
        this.loading = false
      }
    },

    // Save user library to localStorage
    saveUserLibrary() {
      try {
        localStorage.setItem('userLibrary', JSON.stringify(this.userLibrary))
      } catch (error) {
        console.error('Error saving user library:', error)
      }
    },

// Update book status (CRUD - Update)
    updateBookStatus(book, newStatus) {
      const bookIndex = this.userLibrary.findIndex(b => b.id === book.id)
      if (bookIndex !== -1) {
        this.userLibrary[bookIndex] = {
          ...this.userLibrary[bookIndex],
          status: newStatus,
          updatedDate: new Date().toISOString()
        }

        // Add completion date if marked as read
        if (newStatus === 'read') {
          this.userLibrary[bookIndex].completedDate = new Date().toISOString()
        }

        this.saveUserLibrary()

        // Show success toast
        this.$toast.success(`"${book.title}" moved to ${this.getStatusLabel(newStatus)}`)
      }
    },

    // Remove book from library (CRUD - Delete)
    removeBook(book) {
      this.confirmDialog = {
        title: 'Remove Book',
        message: `Are you sure you want to remove "${book.title}" from your library?`,
        action: () => this.confirmRemoveBook(book),
        color: 'error',
        confirmText: 'Remove'
      }
      this.showConfirmDialog = true
    },

    // FIXED: Ensure this method properly removes the book
    confirmRemoveBook(book) {
      console.log('Attempting to remove book:', book.id) // Debug log

      const originalLength = this.userLibrary.length
      this.userLibrary = this.userLibrary.filter(b => b.id !== book.id)

      console.log(`Library size: ${originalLength} -> ${this.userLibrary.length}`) // Debug log

      if (this.userLibrary.length < originalLength) {
        this.saveUserLibrary()
        this.showConfirmDialog = false

        // Show success message (replace with actual toast if available)
        if (this.$toast) {
          this.$toast.success(`"${book.title}" removed from your library`)
        } else {
          console.log(`"${book.title}" removed from your library`)
        }
      } else {
        console.error('Failed to remove book - book not found in library')
        if (this.$toast) {
          this.$toast.error('Failed to remove book')
        }
      }
    },

    // Save book (CRUD - Create/Update)
    async saveBook(bookData) {
      this.saving = true
      try {
        if (this.editingBook && this.editingBook.id) {
          // Update existing book
          const bookIndex = this.userLibrary.findIndex(b => b.id === this.editingBook.id)
          if (bookIndex !== -1) {
            this.userLibrary[bookIndex] = {
              ...this.userLibrary[bookIndex],
              ...bookData,
              updatedDate: new Date().toISOString()
            }
            this.$toast.success('Book updated successfully!')
          }
        } else {
          // Add new custom book
          const newBook = {
            id: `custom_${Date.now()}`,
            ...bookData,
            isCustom: true,
            status: bookData.status || 'want-to-read',
            addedDate: new Date().toISOString(),
            coverUrl: bookData.coverUrl || null
          }

          this.userLibrary.push(newBook)
          this.$toast.success(`"${bookData.title}" added to your library!`)
        }

        this.saveUserLibrary()
        this.cancelBookForm()
      } catch (error) {
        console.error('Error saving book:', error)
        this.$toast.error('Failed to save book. Please try again.')
      } finally {
        this.saving = false
      }
    },


    // Edit book (CRUD - Update)
    editBook(book) {
      this.editingBook = { ...book }
      this.showAddBookDialog = true
    },

    // Cancel book form
    cancelBookForm() {
      this.showAddBookDialog = false
      this.editingBook = null
    },

    // Utility methods
    getStatusLabel(status) {
      const labels = {
        'want-to-read': 'Want to Read',
        'currently-reading': 'Currently Reading',
        'read': 'Read'
      }
      return labels[status] || status
    },

    showSuccessMessage(message) {
      // You can replace this with a toast notification library
      console.log('Success:', message)
      // this.$toast.success(message)
    },

    showErrorMessage(message) {
      // You can replace this with a toast notification library
      console.error('Error:', message)
      // this.$toast.error(message)
    }
  }
}
</script>

<style scoped>
.my-library-page {
  min-height: 80vh;
}

.page-header {
  border-bottom: 1px solid #e0e0e0;
}

.v-tabs-window {
  margin-top: 0;
}
</style>
