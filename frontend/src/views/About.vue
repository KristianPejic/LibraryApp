<template>
  <div class="about-page">
    <v-container>
      <!-- Hero Section -->
      <div class="text-center py-8 mb-8">
        <v-icon
          icon="mdi-book-open-page-variant"
          size="80"
          color="primary"
          class="mb-4"
        ></v-icon>

        <h1 class="text-h3 font-weight-bold mb-4">About Our Digital Library</h1>
        <p class="text-h6 text-grey-darken-1 max-width-600 mx-auto">
          Your gateway to millions of books from around the world, powered by the vast collection of Open Library.
        </p>
      </div>

      <!-- Library Overview -->
      <v-row class="mb-8">
        <v-col cols="12" md="8" class="mx-auto">
          <v-card elevation="2" class="pa-6">
            <h2 class="text-h4 font-weight-bold mb-4">Our Digital Collection</h2>
            <p class="text-body-1 mb-4">
              Welcome to a comprehensive digital library that brings together millions of books,
              spanning every genre, language, and time period imaginable. Our platform provides
              free access to an incredible wealth of knowledge, stories, and information that
              has shaped human culture throughout history.
            </p>
            <p class="text-body-1">
              Whether you're searching for the latest bestsellers, classic literature,
              academic texts, or rare historical documents, our library serves as your
              personal guide through this vast literary landscape.
            </p>
          </v-card>
        </v-col>
      </v-row>

      <!-- Contact & Location Section -->
      <div class="mb-8">
        <h2 class="text-h4 font-weight-bold text-center mb-6">Visit & Contact Us</h2>
        <v-row>
          <!-- Location Card -->
          <v-col cols="12" md="6">
            <v-card class="pa-6" elevation="2" height="100%">
              <div class="d-flex align-center mb-4">
                <v-icon icon="mdi-map-marker" color="primary" size="32" class="me-3"></v-icon>
                <h3 class="text-h5 font-weight-bold">Our Location</h3>
              </div>

              <div class="mb-3">
                <h4 class="text-subtitle-1 font-weight-bold mb-2">Book Library Headquarters</h4>
                <p class="text-body-1 mb-1">123 Library Street</p>
                <p class="text-body-1 mb-1">Knowledge District</p>
                <p class="text-body-1 mb-3">Zagreb 10000, Croatia</p>
              </div>

              <div class="mb-4">
                <h4 class="text-subtitle-1 font-weight-bold mb-2">Opening Hours</h4>
                <p class="text-body-2 mb-1">Monday - Friday: 9:00 AM - 8:00 PM</p>
                <p class="text-body-2 mb-1">Saturday: 10:00 AM - 6:00 PM</p>
                <p class="text-body-2 mb-1">Sunday: 12:00 PM - 5:00 PM</p>
              </div>

              <v-btn
                href="https://maps.google.com"
                target="_blank"
                variant="outlined"
                color="primary"
                prepend-icon="mdi-directions"
                block
              >
                Get Directions
              </v-btn>
            </v-card>
          </v-col>

          <!-- Contact Card -->
          <v-col cols="12" md="6">
            <v-card class="pa-6" elevation="2" height="100%">
              <div class="d-flex align-center mb-4">
                <v-icon icon="mdi-phone" color="success" size="32" class="me-3"></v-icon>
                <h3 class="text-h5 font-weight-bold">Contact Information</h3>
              </div>

              <div class="contact-item mb-4">
                <div class="d-flex align-center mb-2">
                  <v-icon icon="mdi-email" size="20" class="me-2 text-grey-darken-1"></v-icon>
                  <span class="text-body-1 font-weight-bold">Email</span>
                </div>
                <p class="text-body-2 ml-6">info@booklibrary.hr</p>
                <p class="text-body-2 ml-6">support@booklibrary.hr</p>
              </div>

              <div class="contact-item mb-4">
                <div class="d-flex align-center mb-2">
                  <v-icon icon="mdi-phone" size="20" class="me-2 text-grey-darken-1"></v-icon>
                  <span class="text-body-1 font-weight-bold">Phone</span>
                </div>
                <p class="text-body-2 ml-6">+385 1 234 5678</p>
                <p class="text-body-2 ml-6">+385 1 234 5679 (Support)</p>
              </div>

              <div class="contact-item mb-4">
                <div class="d-flex align-center mb-2">
                  <v-icon icon="mdi-web" size="20" class="me-2 text-grey-darken-1"></v-icon>
                  <span class="text-body-1 font-weight-bold">Online</span>
                </div>
                <p class="text-body-2 ml-6">www.booklibrary.hr</p>
              </div>

              <v-btn
                href="mailto:info@booklibrary.hr"
                color="success"
                variant="elevated"
                prepend-icon="mdi-email-send"
                block
              >
                Send Us a Message
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <!-- Quick Actions -->
      <div class="text-center py-6">
        <v-card class="mx-auto pa-6" max-width="600" elevation="3" color="blue-grey-lighten-5">
          <h3 class="text-h5 font-weight-bold mb-4">Ready to Start Reading?</h3>
          <p class="text-body-1 mb-4">
            Explore millions of books and build your personal digital library today.
          </p>
          <div class="d-flex justify-center flex-wrap ga-4">
            <v-btn
              to="/books"
              color="primary"
              variant="elevated"
              prepend-icon="mdi-book-search"
            >
              Browse Books
            </v-btn>
            <v-btn
              to="/my-library"
              variant="outlined"
              color="primary"
              prepend-icon="mdi-bookshelf"
            >
              My Library
            </v-btn>
          </div>
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'About',
  mounted() {
    document.title = 'About - Book Library'
  }
}
</script>

<style scoped>
.about-page {
  min-height: 80vh;
}

.max-width-600 {
  max-width: 600px;
}

.contact-item {
  border-left: 3px solid #1976d2;
  padding-left: 12px;
}
</style>
