<template>
  <v-card class="book-form">
    <v-card-title>
      {{ book ? 'Edit Book' : 'Add Custom Book' }}
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

        <v-text-field
          v-model="formData.genre"
          label="Genre"
          variant="outlined"
        ></v-text-field>

        <v-textarea
          v-model="formData.description"
          label="Description"
          variant="outlined"
          rows="3"
        ></v-textarea>

        <v-select
          v-model="formData.status"
          :items="statusOptions"
          label="Reading Status"
          variant="outlined"
        ></v-select>
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
          {{ book ? 'Update Book' : 'Add Book' }}
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
        genre: '',
        description: '',
        status: 'want-to-read'
      },
      statusOptions: [
        { title: 'Want to Read', value: 'want-to-read' },
        { title: 'Currently Reading', value: 'currently-reading' },
        { title: 'Read', value: 'read' }
      ]
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
  watch: {
    book: {
      handler(newBook) {
        if (newBook) {
          this.formData = {
            title: newBook.title || '',
            authors: newBook.authors || [],
            publishYear: newBook.publishYear || null,
            genre: newBook.genre || '',
            description: newBook.description || '',
            status: newBook.status || 'want-to-read'
          }
        } else {
          this.formData = {
            title: '',
            authors: [],
            publishYear: null,
            genre: '',
            description: '',
            status: 'want-to-read'
          }
        }
      },
      immediate: true
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
