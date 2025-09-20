<template>
  <v-footer color="grey-lighten-2" class="text-center py-4">
    <div class="w-100">
      <p class="text-body-2 mb-1">
        © {{ currentYear }} Book Library - Made by <strong>Martina Crnogorac</strong>
      </p>
    </div>
  </v-footer>
</template>

<script>
export default {
  name: 'AppFooter',
  computed: {
    currentYear() {
      return new Date().getFullYear()
    }
  }
}
</script>

<style scoped>
.v-footer {
  border-top: 1px solid #e0e0e0;
}
</style>
