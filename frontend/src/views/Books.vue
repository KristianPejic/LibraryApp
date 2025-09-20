<template>
  <div class="books-page">
    <v-container>
      <div class="page-header py-6">
        <h1 class="text-h3 font-weight-bold mb-2">Browse Books</h1>
        <p class="text-h6 text-grey-darken-1">
          Discover your next great read from our extensive collection
        </p>
      </div>

      <!-- Search & Filters Section -->
      <v-row class="mb-6">
        <v-col cols="12" md="8">
          <v-card elevation="2">
            <v-card-text class="pa-2">
              <v-text-field
                v-model="searchQuery"
                placeholder="Search books, authors, genres..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="comfortable"
                hide-details
                clearable
                :loading="loading"
                @keyup.enter="performSearch"
                @click:clear="clearSearch"
              >
                <template v-slot:append>
                  <v-btn
                    color="primary"
                    @click="performSearch"
                    :disabled="!searchQuery || !searchQuery.trim()"
                    :loading="loading"
                  >
                    Search
                  </v-btn>
                </template>
              </v-text-field>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4" class="d-flex align-center">
          <v-select
            v-model="sortBy"
            :items="sortOptions"
            label="Sort by"
            variant="outlined"
            density="compact"
            @update:model-value="applySort"
          ></v-select>
        </v-col>
      </v-row>

      <!-- Simple Filter Row -->
      <v-row class="mb-6">
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="filters.author"
            label="Filter by Author"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            prepend-inner-icon="mdi-account"
            @keyup.enter="applyFilters"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="4">
          <v-select
            v-model="filters.subject"
            :items="subjectOptions"
            label="Filter by Genre"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            prepend-inner-icon="mdi-tag"
            @update:model-value="applyFilters"
          ></v-select>
        </v-col>

        <v-col cols="12" sm="4">
          <v-btn
            @click="applyFilters"
            color="primary"
            block
            :loading="loading"
          >
            Apply Filters
          </v-btn>
        </v-col>
      </v-row>

      <!-- Results Info -->
      <div v-if="searchPerformed" class="results-info mb-4">
        <p class="text-body-1">
          <span v-if="books.length > 0">
            Showing {{ books.length }} of {{ totalFound }} results
            <span v-if="searchQuery"> for "<strong>{{ searchQuery }}</strong>"</span>
          </span>
          <span v-else-if="!loading">
            No books found
            <span v-if="searchQuery"> for "<strong>{{ searchQuery }}</strong>"</span>
          </span>
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="text-h6 mt-4">{{ loadingMessage }}</p>
      </div>

      <!-- Books Grid -->
      <v-row v-else-if="books.length > 0">
        <v-col
          v-for="book in books"
          :key="book.id"
          cols="6"
          sm="4"
          md="3"
          lg="2"
        >
          <BookCard :book="book" @click="goToBookDetails(book)" />
        </v-col>
      </v-row>

      <!-- Empty State -->
      <div v-else-if="searchPerformed" class="empty-state text-center py-12">
        <v-icon icon="mdi-book-search" size="80" color="grey-lighten-1" class="mb-4"></v-icon>
        <h3 class="text-h4 mb-4">No Books Found</h3>
        <p class="text-body-1 text-grey-darken-1 mb-6">
          <span v-if="searchQuery">
            We couldn't find any books matching "<strong>{{ searchQuery }}</strong>".
          </span>
          <span v-else>
            Try adjusting your search criteria or browse our popular categories.
          </span>
        </p>
        <div class="d-flex flex-column flex-sm-row justify-center ga-4">
          <v-btn @click="clearAllFilters" variant="outlined" prepend-icon="mdi-refresh">
            Clear All Filters
          </v-btn>
          <v-btn @click="searchPopular" color="primary" prepend-icon="mdi-fire">
            Browse Popular Books
          </v-btn>
        </div>
      </div>

      <!-- Welcome State -->
      <div v-else-if="!searchPerformed && !loading" class="welcome-state text-center py-12">
        <v-icon icon="mdi-magnify" size="80" color="primary" class="mb-4"></v-icon>
        <h3 class="text-h4 mb-4">Search Our Library</h3>
        <p class="text-body-1 text-grey-darken-1 mb-6">
          Enter a search term above to discover books, authors, or explore by genre
        </p>

        <div class="popular-searches">
          <p class="text-subtitle-1 mb-3">Popular searches:</p>
          <div class="d-flex flex-wrap justify-center ga-2">
            <v-chip
              v-for="term in popularSearches"
              :key="term"
              @click="quickSearch(term)"
              color="primary"
              variant="outlined"
              clickable
            >
              {{ term }}
            </v-chip>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="d-flex justify-center mt-8">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          :disabled="loading"
          @update:model-value="changePage"
        ></v-pagination>
      </div>
    </v-container>
  </div>
</template>

<script>
import { searchBooks, searchBooksByAuthor, searchBooksBySubject } from '@/services/bookService'
import { LOADING_MESSAGES, SORT_OPTIONS } from '@/utils/constants'
import BookCard from '@/components/common/BookCard.vue'

export default {
  name: 'Books',
  components: {
    BookCard
  },
  data() {
    return {
      // Search State
      searchQuery: '',
      searchPerformed: false,

      // Filter Options
      filters: {
        author: '',
        subject: ''
      },

      // Results
      books: [],
      totalFound: 0,
      currentPage: 1,
      totalPages: 0,

      // UI State
      loading: false,
      error: null,
      loadingMessage: 'Searching books...',
      sortBy: 'relevance',

      // Options
      sortOptions: [
        { title: 'Most Relevant', value: 'relevance' },
        { title: 'Newest First', value: 'new' },
        { title: 'Oldest First', value: 'old' }
      ],

      subjectOptions: [
        'fiction', 'romance', 'mystery', 'science fiction', 'fantasy',
        'thriller', 'biography', 'history', 'poetry', 'drama'
      ],

      popularSearches: [
        'Harry Potter', 'Science Fiction', 'Romance', 'Mystery',
        'Fantasy', 'Biography', 'History'
      ]
    }
  },

  watch: {
    '$route.query': {
      handler() {
        this.handleRouteQuery()
      },
      immediate: true
    }
  },

  methods: {
    handleRouteQuery() {
      const { q, author, subject, page } = this.$route.query

      if (q) {
        this.searchQuery = q
        this.performSearch()
      } else if (author) {
        this.filters.author = author
        this.applyFilters()
      } else if (subject) {
        this.filters.subject = subject
        this.applyFilters()
      }

      if (page) {
        this.currentPage = parseInt(page) || 1
      }
    },

    async performSearch(page = 1) {
      if (!this.searchQuery.trim()) return

      this.loading = true
      this.error = null
      this.searchPerformed = true
      this.loadingMessage = LOADING_MESSAGES ?
        LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)] :
        'Searching books...'

      try {
        const response = await searchBooks(this.searchQuery, page, 20, this.sortBy)

        if (response.success) {
          this.books = response.data.books || []
          this.totalFound = response.data.totalFound || 0
          this.totalPages = response.data.totalPages || 0
          this.currentPage = page
        } else {
          throw new Error(response.error || 'Search failed')
        }
      } catch (error) {
        console.error('Search error:', error)
        this.error = error.message
        this.books = []
      } finally {
        this.loading = false
      }
    },

    async applyFilters() {
      if (!this.filters.author && !this.filters.subject) return

      this.loading = true
      this.searchPerformed = true

      try {
        let response

        if (this.filters.author) {
          response = await searchBooksByAuthor(this.filters.author, 1, 20)
        } else if (this.filters.subject) {
          response = await searchBooksBySubject(this.filters.subject, 1, 20)
        }

        if (response && response.success) {
          this.books = response.data.books || []
          this.totalFound = response.data.totalFound || 0
          this.totalPages = response.data.totalPages || 0
        }
      } catch (error) {
        console.error('Filter error:', error)
        this.books = []
      } finally {
        this.loading = false
      }
    },

    clearSearch() {
      this.searchQuery = ''
      this.books = []
      this.searchPerformed = false
    },

    clearAllFilters() {
      this.searchQuery = ''
      this.filters.author = ''
      this.filters.subject = ''
      this.books = []
      this.searchPerformed = false
    },

    applySort() {
      if (this.searchQuery) {
        this.performSearch()
      }
    },

    changePage(page) {
      this.currentPage = page
      if (this.searchQuery) {
        this.performSearch(page)
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    quickSearch(term) {
      this.searchQuery = term
      this.performSearch()
    },

    searchPopular() {
      this.searchQuery = 'fiction'
      this.performSearch()
    },

    goToBookDetails(book) {
      const workId = book.id.split('/').pop()
      this.$router.push(`/books/${workId}`)
    }
  }
}
</script>

<style scoped>
.books-page {
  min-height: 80vh;
}

.page-header {
  border-bottom: 1px solid #e0e0e0;
}

.results-info {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 1rem;
}

.empty-state,
.welcome-state {
  max-width: 600px;
  margin: 0 auto;
}

.popular-searches .v-chip {
  margin: 2px;
}
</style>
