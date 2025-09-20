export const API_ENDPOINTS = {
  BOOKS: {
    SEARCH: '/books/search',
    SEARCH_BY_TITLE: '/books/search/title',
    SEARCH_BY_AUTHOR: '/books/search/author',
    SEARCH_BY_SUBJECT: '/books/search/subject',
    DETAILS: '/books/details',
    TRENDING: '/books/trending'
  }
}

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  BOOKS_PER_PAGE_OPTIONS: [10, 20, 50]
}

export const SORT_OPTIONS = [
  { value: 'relevance', text: 'Most Relevant' },
  { value: 'new', text: 'Newest First' },
  { value: 'old', text: 'Oldest First' },
  { value: 'rating', text: 'Highest Rated' }
]

export const POPULAR_GENRES = [
  'fiction',
  'romance',
  'mystery',
  'science fiction',
  'fantasy',
  'thriller',
  'biography',
  'history',
  'poetry',
  'drama',
  'horror',
  'adventure'
]

export const COVER_SIZES = {
  SMALL: 'S',
  MEDIUM: 'M',
  LARGE: 'L'
}

export const LOADING_MESSAGES = [
  'Searching library...',
  'Finding great books...',
  'Exploring book collections...',
  'Discovering new titles...',
  'Loading book data...'
]

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to server. Please check your internet connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  NO_RESULTS: 'No books found for your search.',
  SEARCH_REQUIRED: 'Please enter a search term.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
}
