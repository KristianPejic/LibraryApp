<template>
  <div class="not-found-page">
    <v-container class="fill-height">
      <v-row align="center" justify="center" class="text-center">
        <v-col cols="12" md="6">
          <!-- 404 Animation/Icon -->
          <div class="error-icon mb-6">
            <v-icon
              icon="mdi-book-search"
              size="120"
              color="grey-lighten-1"
              class="mb-4"
            ></v-icon>
          </div>

          <!-- Error Message -->
          <h1 class="text-h1 font-weight-bold mb-2" style="color: #1976d2;">
            404
          </h1>

          <h2 class="text-h4 mb-4">
            Page Not Found
          </h2>

          <p class="text-body-1 text-grey-darken-1 mb-6">
            Oops! The page you're looking for doesn't exist.
            It might have been moved, deleted, or you entered the wrong URL.
          </p>

          <!-- Action Buttons -->
          <div class="d-flex flex-column flex-sm-row justify-center ga-4">
            <v-btn
              to="/"
              color="primary"
              size="large"
              prepend-icon="mdi-home"
            >
              Go Home
            </v-btn>

            <v-btn
              to="/books"
              color="secondary"
              size="large"
              variant="outlined"
              prepend-icon="mdi-book-multiple"
            >
              Browse Books
            </v-btn>

            <v-btn
              @click="goBack"
              variant="text"
              size="large"
              prepend-icon="mdi-arrow-left"
            >
              Go Back
            </v-btn>
          </div>

          <!-- Search Suggestion -->
          <div class="mt-8">
            <p class="text-body-2 text-grey-darken-2 mb-3">
              Or try searching for something:
            </p>

            <v-card max-width="400" class="mx-auto">
              <v-card-text class="pa-2">
                <v-text-field
                  v-model="searchQuery"
                  placeholder="Search books..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                  @keyup.enter="performSearch"
                >
                  <template v-slot:append>
                    <v-btn
                      @click="performSearch"
                      color="primary"
                      size="small"
                      :disabled="!searchQuery.trim()"
                    >
                      Search
                    </v-btn>
                  </template>
                </v-text-field>
              </v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  data() {
    return {
      searchQuery: ''
    }
  },
  methods: {
    goBack() {
      // Go back in history, or to home if no history
      if (window.history.length > 1) {
        this.$router.go(-1)
      } else {
        this.$router.push('/')
      }
    },

    performSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push({
          name: 'Books',
          query: { q: this.searchQuery.trim() }
        })
      }
    }
  },

  mounted() {
    // Log 404 for analytics (optional)
    console.log('404 Page accessed:', this.$route.fullPath)
  }
}
</script>

<style scoped>
.not-found-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.error-icon {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* Mobile optimizations */
@media (max-width: 600px) {
  .text-h1 {
    font-size: 4rem !important;
  }

  .text-h4 {
    font-size: 1.5rem !important;
  }
}
</style>
