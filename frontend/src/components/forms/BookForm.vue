<template>
  <v-card class="book-form">
    <v-card-title>
      Add Custom Book
    </v-card-title>

    <v-form @submit.prevent="submitForm">
      <v-card-text>
        <v-text-field
          v-model="formData.title"
          label="Book Title"
          variant="outlined"
          required
        ></v-text-field>

        <v-text-field
          v-model="authorsText"
          label="Authors"
          variant="outlined"
          hint="Separate multiple authors with commas"
          required
        ></v-text-field>

        <v-text-field
          v-model.number="formData.publishYear"
          label="Publish Year"
          variant="outlined"
          type="number"
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="$emit('cancel')" variant="text">
          Cancel
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
          type="submit"
          color="primary"
          :loading="loading"
        >
          Add Book
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
export default {
  name: 'BookForm',
  props: {
    book: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['save', 'cancel'],
  data() {
    return {
      formData: {
        title: '',
        authors: [],
        publishYear: null,
        status: 'want-to-read'
      }
    }
  },
  computed: {
    authorsText: {
      get() {
        return this.formData.authors.join(', ')
      },
      set(value) {
        this.formData.authors = value ? value.split(',').map(author => author.trim()) : []
      }
    }
  },
  methods: {
    submitForm() {
      const bookData = {
        ...this.formData,
        authors: this.formData.authors.length > 0 ? this.formData.authors : ['Unknown Author']
      }
      this.$emit('save', bookData)
    }
  }
}
</script>
