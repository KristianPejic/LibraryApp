import apiClient from './api'

/**
 * Search books by query
 * @param {string} query - Search query
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Results per page (default: 20)
 * @param {string} sort - Sort order (default: 'relevance')
 */
export const searchBooks = async (query, page = 1, limit = 20, sort = 'relevance') => {
  try {
    const response = await apiClient.get('/books/search', {
      params: { q: query, page, limit, sort }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Search books by title
 */
export const searchBooksByTitle = async (title, page = 1, limit = 20) => {
  try {
    const response = await apiClient.get('/books/search/title', {
      params: { title, page, limit }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Search books by author
 */
export const searchBooksByAuthor = async (author, page = 1, limit = 20) => {
  try {
    const response = await apiClient.get('/books/search/author', {
      params: { author, page, limit }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Search books by subject/genre
 */
export const searchBooksBySubject = async (subject, page = 1, limit = 20) => {
  try {
    const response = await apiClient.get('/books/search/subject', {
      params: { subject, page, limit }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Get book details by work ID
 */
export const getBookDetails = async (workId) => {
  try {
    const response = await apiClient.get(`/books/details/${workId}`)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Get trending books
 */
export const getTrendingBooks = async (limit = 20) => {
  try {
    const response = await apiClient.get('/books/trending', {
      params: { limit }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

// =====================================
// UTILITY FUNCTIONS
// =====================================

/**
 * Check if book has cover image
 */
export const hasBookCover = (book) => {
  return book.coverUrl && book.coverUrl !== null
}

/**
 * Get book cover URL with fallback
 */
export const getBookCoverUrl = (book, size = 'M') => {
  if (book.coverUrl) {
    return book.coverUrl.replace('-M.jpg', `-${size}.jpg`)
  }

  // Fallback placeholder image
  return `https://via.placeholder.com/128x192/e0e0e0/9e9e9e?text=No+Cover`
}

/**
 * Format book authors for display
 */
export const formatBookAuthors = (authors) => {
  if (!authors || authors.length === 0) return 'Unknown Author'
  if (authors.length === 1) return authors[0]
  if (authors.length === 2) return `${authors[0]} & ${authors[1]}`
  return `${authors[0]} et al.`
}

/**
 * Truncate text to specified length
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Format publish year
 */
export const formatPublishYear = (year) => {
  if (!year) return 'Year unknown'
  return year.toString()
}
