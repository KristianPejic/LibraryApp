<template>
  <div>
    <!-- Hero Section -->
    <v-container fluid class="hero-section">
      <v-row align="center" justify="center" class="fill-height">
        <v-col cols="12" md="8" lg="6" class="text-center">
          <div class="hero-content">
            <v-icon
              icon="mdi-book-open-page-variant"
              size="80"
              color="white"
              class="mb-4"
            ></v-icon>

            <h1 class="text-h2 text-md-h1 font-weight-bold mb-4 text-white">
              Welcome to Book Library
            </h1>

            <p class="text-h6 text-md-h5 text-white mb-6">
              Discover millions of books, explore new genres, and build your personal reading collection.
              Your literary journey starts here.
            </p>

            <!-- Hero Search - WORKING INPUT -->
            <v-card class="mx-auto mb-6" max-width="600" elevation="4">
              <v-card-text class="pa-2">
                <v-text-field
                  v-model="heroSearchQuery"
                  placeholder="Search for books, authors, genres..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  hide-details
                  density="comfortable"
                  @keyup.enter="searchFromHero"
                >
                  <template v-slot:append>
                    <v-btn
                      color="primary"
                      @click="searchFromHero"
                      :disabled="!heroSearchQuery || !heroSearchQuery.trim()"
                    >
                      Search
                    </v-btn>
                  </template>
                </v-text-field>
              </v-card-text>
            </v-card>

            <!-- CTA Buttons -->
            <div class="d-flex flex-column flex-sm-row justify-center ga-4">
              <v-btn
                to="/books"
                color="white"
                size="large"
                variant="elevated"
                prepend-icon="mdi-book-multiple"
                class="text-primary"
              >
                Browse All Books
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Statistics Section -->
    <v-container class="py-8">
      <v-row>
        <v-col
          v-for="stat in statistics"
          :key="stat.title"
          cols="6"
          md="3"
          class="text-center"
        >
          <v-card class="pa-4" elevation="2">
            <v-icon
              :icon="stat.icon"
              :color="stat.color"
              size="48"
              class="mb-2"
            ></v-icon>
            <h3 class="text-h4 font-weight-bold">{{ stat.value }}</h3>
            <p class="text-body-1 text-grey-darken-1">{{ stat.title }}</p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Trending Books Section -->
    <v-container class="py-8">
      <div class="text-center mb-6">
        <h2 class="text-h3 font-weight-bold mb-2">Trending Books</h2>
        <p class="text-h6 text-grey-darken-1">
          Discover what readers are enjoying right now
        </p>
      </div>

      <div v-if="loadingTrending" class="text-center py-8">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="text-h6 mt-4">Loading trending books...</p>
      </div>

      <v-row v-else>
        <v-col
          v-for="book in trendingBooks"
          :key="book.id"
          cols="6"
          sm="4"
          md="3"
          lg="2"
        >
          <BookCard :book="book" @click="goToBookDetails(book)" />
        </v-col>
      </v-row>

      <div class="text-center mt-6">
        <v-btn
          to="/books"
          color="primary"
          variant="outlined"
          prepend-icon="mdi-arrow-right"
        >
          View More Books
        </v-btn>
      </div>
    </v-container>

    <!-- Popular Genres Section -->
    <v-container class="py-8 bg-grey-lighten-5">
      <div class="text-center mb-6">
        <h2 class="text-h3 font-weight-bold mb-2">Popular Genres</h2>
        <p class="text-h6 text-grey-darken-1">
          Explore books by your favorite genres
        </p>
      </div>

      <v-row>
        <v-col
          v-for="genre in popularGenres"
          :key="genre.name"
          cols="6"
          sm="4"
          md="3"
        >
          <v-card
            class="genre-card pa-4 text-center"
            :color="genre.color"
            dark
            hover
            @click="searchByGenre(genre.name)"
          >
            <v-icon :icon="genre.icon" size="48" class="mb-2"></v-icon>
            <h4 class="text-h6 font-weight-medium">{{ genre.display }}</h4>
            <p class="text-body-2 mt-2">{{ genre.description }}</p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import BookCard from '@/components/common/BookCard.vue'
import { getTrendingBooks } from '@/services/bookService'

export default {
  name: 'HomeView',
  components: {
    BookCard
  },
  data() {
    return {
      heroSearchQuery: '',
      trendingBooks: [],
      loadingTrending: false,

      statistics: [
        {
          title: 'Total Books',
          value: '3M+',
          icon: 'mdi-book-multiple',
          color: 'primary'
        },
        {
          title: 'Authors',
          value: '100K+',
          icon: 'mdi-account-group',
          color: 'success'
        },
        {
          title: 'Genres',
          value: '50+',
          icon: 'mdi-tag-multiple',
          color: 'warning'
        },
        {
          title: 'Languages',
          value: '25+',
          icon: 'mdi-translate',
          color: 'info'
        }
      ],

      popularGenres: [
        {
          name: 'fiction',
          display: 'Fiction',
          icon: 'mdi-book',
          color: 'deep-purple',
          description: 'Imaginative stories and novels'
        },
        {
          name: 'romance',
          display: 'Romance',
          icon: 'mdi-heart',
          color: 'pink',
          description: 'Love stories and relationships'
        },
        {
          name: 'mystery',
          display: 'Mystery',
          icon: 'mdi-magnify',
          color: 'indigo',
          description: 'Thrilling mysteries and detective stories'
        },
        {
          name: 'science fiction',
          display: 'Sci-Fi',
          icon: 'mdi-rocket',
          color: 'blue',
          description: 'Future worlds and technology'
        },
        {
          name: 'fantasy',
          display: 'Fantasy',
          icon: 'mdi-magic-staff',
          color: 'purple',
          description: 'Magical worlds and adventures'
        },
        {
          name: 'biography',
          display: 'Biography',
          icon: 'mdi-account-star',
          color: 'teal',
          description: 'Life stories of notable people'
        },
        {
          name: 'history',
          display: 'History',
          icon: 'mdi-library',
          color: 'brown',
          description: 'Historical events and periods'
        },
        {
          name: 'thriller',
          display: 'Thriller',
          icon: 'mdi-lightning-bolt',
          color: 'red',
          description: 'Fast-paced suspenseful stories'
        }
      ]
    }
  },

  async mounted() {
    await this.loadTrendingBooks()
  },

  methods: {
    async loadTrendingBooks() {
      this.loadingTrending = true
      try {
        const response = await getTrendingBooks(12)
        if (response.success && response.data.books) {
          this.trendingBooks = response.data.books
        }
      } catch (error) {
        console.error('Error loading trending books:', error)
        // Fallback to sample data
        this.trendingBooks = [
          {
            id: '/works/OL82563W',
            title: 'Harry Potter and the Philosopher\'s Stone',
            authors: ['J. K. Rowling'],
            publishYear: 1997,
            coverUrl: 'https://covers.openlibrary.org/b/id/8739161-M.jpg'
          },
          {
            id: '/works/OL27448W',
            title: 'The Lord of the Rings',
            authors: ['J. R. R. Tolkien'],
            publishYear: 1954,
            coverUrl: 'https://covers.openlibrary.org/b/id/258027-M.jpg'
          }
        ]
      } finally {
        this.loadingTrending = false
      }
    },

    searchFromHero() {
      if (this.heroSearchQuery && this.heroSearchQuery.trim()) {
        this.$router.push({
          name: 'Books',
          query: { q: this.heroSearchQuery.trim() }
        })
      }
    },

    exploreGenres() {
      this.$router.push({ name: 'Books' })
    },

    searchByGenre(genre) {
      this.$router.push({
        name: 'Books',
        query: { subject: genre }
      })
    },

    goToBookDetails(book) {
      const workId = book.id.split('/').pop()
      this.$router.push(`/books/${workId}`)
    }
  }
}
</script>

<style scoped>
.hero-section {
  min-height: 70vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
}

.hero-content {
  animation: fadeInUp 1s ease-out;
}

.genre-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.genre-card:hover {
  transform: translateY(-4px);
}

.bg-grey-lighten-5 {
  background-color: #fafafa !important;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 960px) {
  .hero-section {
    min-height: 60vh;
    padding: 2rem 0;
  }

  .text-h2 {
    font-size: 2rem !important;
  }
}
</style>
