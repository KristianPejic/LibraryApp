<template>
  <v-app-bar color="primary" dark app>
    <v-toolbar-title>
      <v-icon
        icon="mdi-book-open-page-variant"
        size="40"
        color="white"
        class="mb-4"
      ></v-icon>
      <router-link to="/" class="text-decoration-none text-white">
        Book Library
      </router-link>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <template v-if="$vuetify.display.mdAndUp">
      <v-btn to="/" variant="text">Home</v-btn>
      <v-btn to="/books" variant="text">Books</v-btn>
      <v-btn to="/my-library" variant="text">My Library</v-btn>
      <v-btn to="/about" variant="text">About</v-btn>
    </template>

    <v-app-bar-nav-icon
      v-if="$vuetify.display.smAndDown"
      @click="drawer = !drawer"
    ></v-app-bar-nav-icon>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary>
    <v-list>
      <v-list-item to="/" @click="drawer = false">
        <v-list-item-title>Home</v-list-item-title>
      </v-list-item>
      <v-list-item to="/books" @click="drawer = false">
        <v-list-item-title>Books</v-list-item-title>
      </v-list-item>
      <v-list-item to="/my-library" @click="drawer = false">
        <v-list-item-title>My Library</v-list-item-title>
      </v-list-item>
      <v-list-item to="/about" @click="drawer = false">
        <v-list-item-title>About</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      drawer: false
    }
  }
}
</script>
