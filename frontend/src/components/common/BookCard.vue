<template>
  <v-card
    class="book-card ma-1"
    :elevation="hover ? 8 : 2"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    @click="$emit('click', book)"
  >
    <!-- Book Cover -->
    <div class="book-cover-container">
      <v-img
        :src="bookCoverUrl"
        :alt="`Cover of ${book.title}`"
        aspect-ratio="0.67"
        class="book-cover"
        cover
      >
        <template v-slot:placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-icon
              icon="mdi-book"
              size="48"
              color="grey-lighten-2"
            ></v-icon>
          </div>
        </template>

        <template v-slot:error>
          <div class="d-flex flex-column align-center justify-center fill-height bg-grey-lighten-3">
            <v-icon
              icon="mdi-book-outline"
              size="32"
              color="grey-darken-1"
            ></v-icon>
            <span class="text-caption text-grey-darken-1 mt-1">No Cover</span>
          </div>
        </template>
      </v-img>

      <!-- Overlay Actions -->
      <v-overlay
        v-model="showActions"
        contained
        class="align-center justify-center"
      >
        <div class="d-flex flex-column ga-2">
          <v-btn
            icon="mdi-eye"
            color="white"
            size="large"
            @click.stop="viewDetails"
          ></v-btn>

          <v-btn
            :icon="isInLibrary ? 'mdi-heart' : 'mdi-heart-outline'"
            :color="isInLibrary ? 'red' : 'white'"
            size="large"
            @click.stop="toggleLibrary"
          ></v-btn>
        </div>
      </v-overlay>
    </div>

    <!-- Book Info -->
    <v-card-text class="book-info pa-3">
      <!-- Title -->
      <h4 class="book-title text-subtitle-1 font-weight-medium mb-1">
        {{ truncatedTitle }}
      </h4>

      <!-- Authors -->
      <p class="book-authors text-body-2 text-grey-darken-1 mb-2">
        {{ formattedAuthors }}
      </p>

      <!-- Year & Edition Count -->
      <div class="d-flex justify-space-between align-center mb-2">
        <span v-if="book.publishYear" class="text-caption text-grey-darken-2">
          {{ book.publishYear }}
        </span>

        <v-chip
          v-if="book.editionCount && book.editionCount > 1"
          size="x-small"
          color="primary"
          variant="outlined"
        >
          {{ book.editionCount }} editions
        </v-chip>
      </div>

      <!-- Subjects/Genres -->
      <div v-if="displaySubjects.length > 0" class="mb-2">
        <v-chip
          v-for="subject in displaySubjects"
          :key="subject"
          size="x-small"
          class="me-1 mb-1"
          color="secondary"
          variant="outlined"
        >
          {{ subject }}
        </v-chip>
      </div>

      <!-- Rating Stars (placeholder) -->
      <div class="d-flex align-center">
        <v-rating
          :model-value="randomRating"
          color="amber"
          density="compact"
          half-increments
          readonly
          size="small"
        ></v-rating>
        <span class="text-caption text-grey-darken-2 ml-2">
          ({{ randomRatingCount }})
        </span>
      </div>
    </v-card-text>

    <!-- Quick Actions -->
    <v-card-actions class="pt-0 px-3 pb-3">
      <v-btn
        variant="text"
        size="small"
        @click.stop="viewDetails"
        prepend-icon="mdi-information"
      >
        Details
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn
        variant="text"
        size="small"
        @click.stop="toggleLibrary"
        :prepend-icon="isInLibrary ? 'mdi-heart' : 'mdi-heart-outline'"
        :color="isInLibrary ? 'red' : 'default'"
      >
        {{ isInLibrary ? 'Saved' : 'Save' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { getBookCoverUrl, formatBookAuthors, truncateText } from '@/services/bookService'

export default {
  name: 'BookCard',
  props: {
    book: {
      type: Object,
      required: true
    },
    showRating: {
      type: Boolean,
      default: true
    }
  },
  emits: ['click', 'view-details', 'toggle-library'],
  data() {
    return {
      hover: false,
      showActions: false,
      isInLibrary: false,
      randomRating: 0,
      randomRatingCount: 0
    }
  },
  computed: {
    bookCoverUrl() {
      return getBookCoverUrl(this.book, 'M')
    },
    truncatedTitle() {
      return truncateText(this.book.title, 60)
    },
    formattedAuthors() {
      return formatBookAuthors(this.book.authors)
    },
    displaySubjects() {
      if (!this.book.subjects || this.book.subjects.length === 0) return []
      // Show only first 2 subjects
      return this.book.subjects.slice(0, 2)
    }
  },
  watch: {
    hover(newVal) {
      this.showActions = newVal
    }
  },
  mounted() {
    // Generate random rating for demo purposes
    this.randomRating = Math.random() * 2 + 3 // 3-5 stars
    this.randomRatingCount = Math.floor(Math.random() * 1000) + 10

    // Check if book is in user's library (from localStorage)
    this.checkLibraryStatus()
  },
  methods: {
    viewDetails() {
      const workId = this.book.id.split('/').pop()
      this.$router.push({
        name: 'BookDetails',
        params: { workId }
      })
      this.$emit('view-details', this.book)
    },

    toggleLibrary() {
      this.isInLibrary = !this.isInLibrary
      this.saveLibraryStatus()
      this.$emit('toggle-library', this.book, this.isInLibrary)

      // Show toast notification
      const message = this.isInLibrary
        ? `"${this.book.title}" added to your library!`
        : `"${this.book.title}" removed from your library`

      // Access toast through Vue's global properties
      if (this.isInLibrary) {
        this.$toast.success(message)
      } else {
        this.$toast.info(message)
      }
    },

    checkLibraryStatus() {
      try {
        const library = JSON.parse(localStorage.getItem('userLibrary') || '[]')
        this.isInLibrary = library.some(savedBook => savedBook.id === this.book.id)
      } catch (error) {
        console.error('Error checking library status:', error)
        this.isInLibrary = false
      }
    },

    saveLibraryStatus() {
      try {
        let library = JSON.parse(localStorage.getItem('userLibrary') || '[]')

        if (this.isInLibrary) {
          // Add to library if not already present
          if (!library.some(savedBook => savedBook.id === this.book.id)) {
            library.push({
              id: this.book.id,
              title: this.book.title,
              authors: this.book.authors,
              coverUrl: this.book.coverUrl,
              addedDate: new Date().toISOString()
            })
          }
        } else {
          // Remove from library
          library = library.filter(savedBook => savedBook.id !== this.book.id)
        }

        localStorage.setItem('userLibrary', JSON.stringify(library))
      } catch (error) {
        console.error('Error saving library status:', error)
      }
    }
  }
}
</script>

<style scoped>
.book-card {
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.book-card:hover {
  transform: translateY(-4px);
}

.book-cover-container {
  position: relative;
  flex-shrink: 0;
}

.book-cover {
  border-radius: 4px 4px 0 0;
}

.book-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.book-title {
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-authors {
  line-height: 1.1;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.v-overlay {
  border-radius: 4px 4px 0 0;
}

/* Mobile optimizations */
@media (max-width: 600px) {
  .book-info {
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
