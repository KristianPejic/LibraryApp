const API_CONSTANTS = {
    OPEN_LIBRARY: {
        BASE_URL: 'https://openlibrary.org',
        COVERS_URL: 'https://covers.openlibrary.org',
        SEARCH_ENDPOINT: '/search.json',
        WORK_ENDPOINT: '/works',
        BOOKS_ENDPOINT: '/books'
    },

    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_LIMIT: 20,
        MAX_LIMIT: 100
    },

    COVER_SIZES: {
        SMALL: 'S',
        MEDIUM: 'M',
        LARGE: 'L'
    },

    SORT_OPTIONS: {
        RELEVANCE: 'relevance',
        NEW: 'new',
        OLD: 'old',
        RATING: 'rating'
    },

    POPULAR_SUBJECTS: [
        'fiction',
        'romance',
        'mystery',
        'science fiction',
        'fantasy',
        'thriller',
        'biography',
        'history',
        'poetry',
        'drama'
    ]
}

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
}

const ERROR_MESSAGES = {
    SEARCH_QUERY_REQUIRED: 'Search query is required',
    TITLE_REQUIRED: 'Title is required',
    AUTHOR_REQUIRED: 'Author is required',
    SUBJECT_REQUIRED: 'Subject is required',
    WORK_ID_REQUIRED: 'Work ID is required',
    BOOK_NOT_FOUND: 'Book not found',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    API_TIMEOUT: 'API request timeout',
    NETWORK_ERROR: 'Network error occurred'
}

module.exports = {
    API_CONSTANTS,
    HTTP_STATUS,
    ERROR_MESSAGES
}