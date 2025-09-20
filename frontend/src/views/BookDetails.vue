<template>
  <div class="book-details-page">
    <!-- Loading State -->
    <div v-if="loading" class="d-flex justify-center align-center" style="min-height: 60vh;">
      <div class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
        <p class="text-h6 mt-4">Loading book details...</p>
      </div>
    </div>

    <!-- Error State -->
    <v-container v-else-if="error">
      <v-alert type="error" class="mb-4">
        <h3>Failed to Load Book</h3>
        <p>{{ error }}</p>
        <div class="mt-4">
          <v-btn @click="loadBookDetails" color="primary" class="me-2">
            Retry
          </v-btn>
          <v-btn to="/books" variant="outlined">
            Back to Books
          </v-btn>
        </div>
      </v-alert>
    </v-container>

    <!-- Book Details Content -->
    <v-container v-else-if="book">
      <!-- Breadcrumbs -->
      <v-breadcrumbs :items="breadcrumbs" class="px-0"></v-breadcrumbs>

      <v-row>
        <!-- Book Cover Column -->
        <v-col cols="12" md="4" lg="3">
          <div class="book-cover-section">
            <v-card elevation="8" class="book-cover-card">
              <v-img
                :src="bookCoverUrl"
                :alt="`Cover of ${book.title}`"
                aspect-ratio="0.67"
                cover
                class="book-cover-large"
              >
                <template v-slot:error>
                  <div class="d-flex align-center justify-center fill-height bg-grey-lighten-3">
                    <div class="text-center">
                      <v-icon icon="mdi-book" size="64" color="grey-darken-1"></v-icon>
                      <p class="text-caption mt-2">No Cover Available</p>
                    </div>
                  </div>
                </template>
              </v-img>
            </v-card>

            <!-- Action Buttons -->
            <div class="mt-4">
              <v-btn
                @click="toggleLibrary"
                :color="isInLibrary ? 'success' : 'primary'"
                :variant="isInLibrary ? 'elevated' : 'outlined'"
                :prepend-icon="isInLibrary ? 'mdi-heart' : 'mdi-heart-outline'"
                block
                size="large"
                class="mb-3"
              >
                {{ isInLibrary ? 'In Your Library' : 'Add to Library' }}
              </v-btn>

              <v-select
                v-if="isInLibrary"
                v-model="bookStatus"
                :items="statusOptions"
                label="Reading Status"
                variant="outlined"
                @update:model-value="updateBookStatus"
              ></v-select>
            </div>
          </div>
        </v-col>

        <!-- Book Information Column -->
        <v-col cols="12" md="8" lg="9">
          <div class="book-info-section">
            <!-- Title and Basic Info -->
            <div class="mb-6">
              <h1 class="text-h3 font-weight-bold mb-3">{{ book.title }}</h1>

              <div v-if="book.subtitle" class="text-h5 text-grey-darken-1 mb-3">
                {{ book.subtitle }}
              </div>

              <div class="book-meta mb-4">
                <div v-if="formattedAuthors" class="text-h6 mb-2">
                  <v-icon icon="mdi-account" class="me-2"></v-icon>
                  <span v-for="(author, index) in book.authors" :key="index">
                    <router-link
                      :to="`/books?author=${author.name || author}`"
                      class="text-decoration-none text-primary"
                    >
                      {{ author.name || author }}
                    </router-link>
                    <span v-if="index < book.authors.length - 1">, </span>
                  </span>
                </div>

                <div v-if="book.first_publish_date" class="text-body-1 mb-2">
                  <v-icon icon="mdi-calendar" class="me-2"></v-icon>
                  First published: {{ formatDate(book.first_publish_date) }}
                </div>

                <div v-if="book.number_of_pages" class="text-body-1 mb-2">
                  <v-icon icon="mdi-book-open" class="me-2"></v-icon>
                  {{ book.number_of_pages }} pages
                </div>

                <div v-if="book.publishers && book.publishers.length" class="text-body-1 mb-2">
                  <v-icon icon="mdi-domain" class="me-2"></v-icon>
                  {{ book.publishers.join(', ') }}
                </div>
              </div>

              <!-- Rating (Placeholder) -->
              <div class="mb-4">
                <v-rating
                  :model-value="randomRating"
                  color="amber"
                  half-increments
                  readonly
                  density="comfortable"
                ></v-rating>
                <span class="text-body-2 text-grey-darken-2 ml-2">
                  {{ randomRating.toFixed(1) }}/5 ({{ randomRatingCount }} reviews)
                </span>
              </div>
            </div>

            <!-- Description -->
            <div v-if="book.description" class="mb-6">
              <h2 class="text-h5 font-weight-bold mb-3">Description</h2>
              <div class="text-body-1 description-text">
                <div v-if="showFullDescription || book.description.length < 500">
                  {{ typeof book.description === 'object' ? book.description.value : book.description }}
                </div>
                <div v-else>
                  {{ (typeof book.description === 'object' ? book.description.value : book.description).substring(0, 500) }}...
                  <v-btn
                    @click="showFullDescription = true"
                    variant="text"
                    color="primary"
                    size="small"
                    class="ml-2"
                  >
                    Read More
                  </v-btn>
                </div>
              </div>
            </div>

            <!-- Subjects/Genres -->
            <div v-if="book.subjects && book.subjects.length" class="mb-6">
              <h3 class="text-h6 font-weight-bold mb-3">Genres & Topics</h3>
              <div class="d-flex flex-wrap ga-2">
                <v-chip
                  v-for="subject in book.subjects.slice(0, 15)"
                  :key="subject"
                  :to="`/books?subject=${subject}`"
                  color="primary"
                  variant="outlined"
                  size="small"
                  clickable
                >
                  {{ subject }}
                </v-chip>
              </div>
            </div>

            <!-- Additional Information -->
            <v-row class="mb-6">
              <v-col v-if="book.isbn_13 || book.isbn_10" cols="12" sm="6">
                <h4 class="text-subtitle-1 font-weight-bold mb-2">ISBN</h4>
                <div v-if="book.isbn_13">
                  <strong>ISBN-13:</strong> {{ book.isbn_13[0] }}
                </div>
                <div v-if="book.isbn_10">
                  <strong>ISBN-10:</strong> {{ book.isbn_10[0] }}
                </div>
              </v-col>

              <v-col v-if="book.languages" cols="12" sm="6">
                <h4 class="text-subtitle-1 font-weight-bold mb-2">Languages</h4>
                <div>{{ formatLanguages(book.languages) }}</div>
              </v-col>
            </v-row>

            <!-- Related Books -->
            <div v-if="relatedBooks.length > 0" class="mb-6">
              <h3 class="text-h6 font-weight-bold mb-3">You Might Also Like</h3>
              <v-row>
                <v-col
                  v-for="relatedBook in relatedBooks.slice(0, 4)"
                  :key="relatedBook.id"
                  cols="6"
                  sm="3"
                >
                  <BookCard
                    :book="relatedBook"
                    @click="goToBook(relatedBook)"
                  />
                </v-col>
              </v-row>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { getBookDetails } from '@/services/bookService'
import { searchBooksByAuthor, searchBooksBySubject } from '@/services/bookService'
import BookCard from '@/components/common/BookCard.vue'

export default {
  name: 'BookDetails',
  components: {
    BookCard
  },
  props: {
    workId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      book: null,
      loading: false,
      error: null,
      showFullDescription: false,
      isInLibrary: false,
      bookStatus: 'want-to-read',
      randomRating: 0,
      randomRatingCount: 0,
      relatedBooks: [],

      statusOptions: [
        { title: 'Want to Read', value: 'want-to-read' },
        { title: 'Currently Reading', value: 'currently-reading' },
        { title: 'Read', value: 'read' }
      ]
    }
  },
  computed: {
    breadcrumbs() {
      return [
        { title: 'Home', to: '/' },
        { title: 'Books', to: '/books' },
        { title: this.book?.title || 'Book Details', disabled: true }
      ]
    },

    bookCoverUrl() {
      if (this.book?.covers && this.book.covers.length > 0) {
        return `https://covers.openlibrary.org/b/id/${this.book.covers[0]}-L.jpg`
      }
      return null
    },

    formattedAuthors() {
      if (!this.book?.authors) return ''
      return this.book.authors.map(author => author.name || author).join(', ')
    }
  },
  async mounted() {
    await this.loadBookDetails()
    this.checkLibraryStatus()
    this.generateRandomRating()
  },
  watch: {
    workId() {
      this.loadBookDetails()
    }
  },
  methods: {
    async loadBookDetails() {
      this.loading = true
      this.error = null

      try {
        const response = await getBookDetails(this.workId)

        if (response.success) {
          this.book = response.data
          await this.loadRelatedBooks()
        } else {
          throw new Error(response.error || 'Failed to load book details')
        }
      } catch (error) {
        console.error('Error loading book details:', error)
        this.error = error.message || 'Failed to load book details'
      } finally {
        this.loading = false
      }
    },

    async loadRelatedBooks() {
      if (!this.book) return

      try {
        let relatedResponse

        // Try to get related books by author first
        if (this.book.authors && this.book.authors.length > 0) {
          const authorName = this.book.authors[0].name || this.book.authors[0]
          relatedResponse = await searchBooksByAuthor(authorName, 1, 8)
        }

        // If no author results, try by subject
        if (!relatedResponse || !relatedResponse.success || relatedResponse.data.books.length < 2) {
          if (this.book.subjects && this.book.subjects.length > 0) {
            const subject = this.book.subjects[0]
            relatedResponse = await searchBooksBySubject(subject, 1, 8)
          }
        }

        if (relatedResponse && relatedResponse.success) {
          // Filter out current book
          this.relatedBooks = relatedResponse.data.books
            .filter(book => book.id !== `/works/${this.workId}`)
            .slice(0, 4)
        }
      } catch (error) {
        console.error('Error loading related books:', error)
      }
    },

    toggleLibrary() {
      this.isInLibrary = !this.isInLibrary
      this.saveLibraryStatus()

      const message = this.isInLibrary
        ? `"${this.book.title}" added to your library!`
        : `"${this.book.title}" removed from your library`

      if (this.isInLibrary) {
        this.$toast.success(message)
      } else {
        this.$toast.info(message)
      }
    },

    updateBookStatus(newStatus) {
      this.bookStatus = newStatus
      this.saveLibraryStatus()
      this.$toast.success(`Status updated to "${this.getStatusLabel(newStatus)}"`)
    },

    checkLibraryStatus() {
      try {
        const library = JSON.parse(localStorage.getItem('userLibrary') || '[]')
        const bookInLibrary = library.find(book => book.id === `/works/${this.workId}`)

        if (bookInLibrary) {
          this.isInLibrary = true
          this.bookStatus = bookInLibrary.status || 'want-to-read'
        }
      } catch (error) {
        console.error('Error checking library status:', error)
      }
    },

    saveLibraryStatus() {
      try {
        let library = JSON.parse(localStorage.getItem('userLibrary') || '[]')
        const bookId = `/works/${this.workId}`

        if (this.isInLibrary) {
          const existingIndex = library.findIndex(book => book.id === bookId)

          const bookData = {
            id: bookId,
            title: this.book.title,
            authors: this.book.authors?.map(a => a.name || a) || ['Unknown'],
            publishYear: this.book.first_publish_year,
            coverUrl: this.bookCoverUrl,
            status: this.bookStatus,
            addedDate: new Date().toISOString()
          }

          if (existingIndex > -1) {
            library[existingIndex] = { ...library[existingIndex], ...bookData }
          } else {
            library.push(bookData)
          }
        } else {
          library = library.filter(book => book.id !== bookId)
        }

        localStorage.setItem('userLibrary', JSON.stringify(library))
      } catch (error) {
        console.error('Error saving library status:', error)
      }
    },

    generateRandomRating() {
      this.randomRating = Math.random() * 2 + 3 // 3-5 stars
      this.randomRatingCount = Math.floor(Math.random() * 1000) + 50
    },

    formatDate(dateString) {
      if (!dateString) return ''
      return new Date(dateString).getFullYear()
    },

    formatLanguages(languages) {
      if (!languages) return ''
      return languages.map(lang => {
        const langMap = {
          'eng': 'English',
          'fre': 'French',
          'spa': 'Spanish',
          'ger': 'German'
        }
        return langMap[lang.key] || lang.key
      }).join(', ')
    },

    getStatusLabel(status) {
      const labels = {
        'want-to-read': 'Want to Read',
        'currently-reading': 'Currently Reading',
        'read': 'Read'
      }
      return labels[status] || status
    },

    goToBook(book) {
      const workId = book.id.split('/').pop()
      this.$router.push(`/books/${workId}`)
    }
  }
}
</script>

<style scoped>
.book-details-page {
  min-height: 80vh;
}

.book-cover-card {
  max-width: 300px;
  margin: 0 auto;
}

.book-cover-large {
  border-radius: 8px;
}

.book-cover-section {
  position: sticky;
  top: 100px;
}

.description-text {
  line-height: 1.6;
  white-space: pre-line;
}

.book-meta {
  border-left: 3px solid #1976d2;
  padding-left: 16px;
}

@media (max-width: 960px) {
  .book-cover-section {
    position: static;
    margin-bottom: 2rem;
  }

  .book-cover-card {
    max-width: 250px;
  }
}
</style>
