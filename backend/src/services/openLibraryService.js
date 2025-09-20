const axios = require('axios')

const OPEN_LIBRARY_BASE_URL = 'https://openlibrary.org'
const COVERS_BASE_URL = 'https://covers.openlibrary.org'

// User-Agent header za rate limiting compliance
const USER_AGENT = 'BookLibraryApp/1.0 (student.project@example.com)'

// Axios instance s konfiguriranim headerima
const apiClient = axios.create({
    timeout: 10000,
    headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'application/json'
    }
})

// =====================================
// SEARCH FUNCTIONS
// =====================================

/**
 * Pretraži knjige po query stringu
 * @param {string} query - Search query
 * @param {number} page - Broj stranice (default: 1)
 * @param {number} limit - Broj rezultata po stranici (default: 20)
 * @param {string} sort - Sortiranje: 'new', 'old', 'rating'
 */
const searchBooks = async (query, page = 1, limit = 20, sort = 'relevance') => {
    try {
        const params = {
            q: query,
            page: page,
            limit: limit,
            fields: 'key,title,author_name,first_publish_year,cover_i,isbn,subject,language,edition_count,publisher'
        }

        if (sort !== 'relevance') {
            params.sort = sort
        }

        const response = await apiClient.get(`${OPEN_LIBRARY_BASE_URL}/search.json`, { params })

        return {
            success: true,
            data: {
                books: response.data.docs || [],
                totalFound: response.data.num_found || 0,
                start: response.data.start || 0,
                page: page,
                limit: limit,
                totalPages: Math.ceil((response.data.num_found || 0) / limit)
            }
        }
    } catch (error) {
        console.error('Error searching books:', error.message)
        return {
            success: false,
            error: 'Failed to search books',
            details: error.message
        }
    }
}

/**
 * Pretraži knjige po naslovu
 */
const searchBooksByTitle = async (title, page = 1, limit = 20) => {
    try {
        const params = {
            title: title,
            page: page,
            limit: limit,
            fields: 'key,title,author_name,first_publish_year,cover_i,isbn,edition_count'
        }

        const response = await apiClient.get(`${OPEN_LIBRARY_BASE_URL}/search.json`, { params })

        return {
            success: true,
            data: {
                books: response.data.docs || [],
                totalFound: response.data.num_found || 0,
                start: response.data.start || 0,
                page: page,
                limit: limit,
                totalPages: Math.ceil((response.data.num_found || 0) / limit)
            }
        }
    } catch (error) {
        console.error('Error searching books by title:', error.message)
        return {
            success: false,
            error: 'Failed to search books by title'
        }
    }
}

/**
 * Pretraži knjige po autoru
 */
const searchBooksByAuthor = async (author, page = 1, limit = 20) => {
    try {
        const params = {
            author: author,
            page: page,
            limit: limit,
            fields: 'key,title,author_name,first_publish_year,cover_i,isbn,edition_count'
        }

        const response = await apiClient.get(`${OPEN_LIBRARY_BASE_URL}/search.json`, { params })

        return {
            success: true,
            data: {
                books: response.data.docs || [],
                totalFound: response.data.num_found || 0,
                start: response.data.start || 0,
                page: page,
                limit: limit,
                totalPages: Math.ceil((response.data.num_found || 0) / limit)
            }
        }
    } catch (error) {
        console.error('Error searching books by author:', error.message)
        return {
            success: false,
            error: 'Failed to search books by author'
        }
    }
}

/**
 * Pretraži knjige po žanru/temi
 */
const searchBooksBySubject = async (subject, page = 1, limit = 20) => {
    try {
        const params = {
            subject: subject,
            page: page,
            limit: limit,
            fields: 'key,title,author_name,first_publish_year,cover_i,isbn,subject'
        }

        const response = await apiClient.get(`${OPEN_LIBRARY_BASE_URL}/search.json`, { params })

        return {
            success: true,
            data: {
                books: response.data.docs || [],
                totalFound: response.data.num_found || 0,
                start: response.data.start || 0,
                page: page,
                limit: limit,
                totalPages: Math.ceil((response.data.num_found || 0) / limit)
            }
        }
    } catch (error) {
        console.error('Error searching books by subject:', error.message)
        return {
            success: false,
            error: 'Failed to search books by subject'
        }
    }
}

// =====================================
// BOOK DETAILS FUNCTIONS
// =====================================

/**
 * Dobij detalje o knjizi po Work ID
 * @param {string} workId - Open Library Work ID (npr. "OL45804W")
 */
const getBookDetails = async (workId) => {
    try {
        const response = await apiClient.get(`${OPEN_LIBRARY_BASE_URL}/works/${workId}.json`)

        return {
            success: true,
            data: response.data
        }
    } catch (error) {
        console.error('Error getting book details:', error.message)
        return {
            success: false,
            error: 'Failed to get book details'
        }
    }
}

/**
 * Dobij editions za Work
 */
const getBookEditions = async (workId, limit = 10) => {
    try {
        const params = { limit }
        const response = await apiClient.get(`${OPEN_LIBRARY_BASE_URL}/works/${workId}/editions.json`, { params })

        return {
            success: true,
            data: response.data
        }
    } catch (error) {
        console.error('Error getting book editions:', error.message)
        return {
            success: false,
            error: 'Failed to get book editions'
        }
    }
}

// =====================================
// COVER IMAGE FUNCTIONS
// =====================================

/**
 * Generiraj URL za cover sliku
 * @param {number|string} coverId - Cover ID
 * @param {string} size - Size: 'S', 'M', 'L' (default: 'M')
 */
const getCoverImageUrl = (coverId, size = 'M') => {
    if (!coverId) return null
    return `${COVERS_BASE_URL}/b/id/${coverId}-${size}.jpg`
}

/**
 * Generiraj URL za cover sliku po ISBN-u
 */
const getCoverImageUrlByISBN = (isbn, size = 'M') => {
    if (!isbn) return null
    return `${COVERS_BASE_URL}/b/isbn/${isbn}-${size}.jpg`
}

// =====================================
// UTILITY FUNCTIONS
// =====================================

/**
 * Format book data za frontend
 */
const formatBookData = (book) => {
    return {
        id: book.key,
        title: book.title,
        authors: book.author_name || [],
        publishYear: book.first_publish_year,
        coverUrl: book.cover_i ? getCoverImageUrl(book.cover_i) : null,
        coverUrlSmall: book.cover_i ? getCoverImageUrl(book.cover_i, 'S') : null,
        coverUrlLarge: book.cover_i ? getCoverImageUrl(book.cover_i, 'L') : null,
        isbn: book.isbn || [],
        subjects: book.subject || [],
        languages: book.language || [],
        editionCount: book.edition_count,
        publishers: book.publisher || []
    }
}

/**
 * Format multiple books
 */
const formatBooksData = (books) => {
    return books.map(formatBookData)
}

// =====================================
// POPULAR/TRENDING BOOKS
// =====================================

/**
 * Dobij popularne knjige (trending subjects)
 */
const getTrendingBooks = async (limit = 20) => {
    try {
        // Koristimo popularne žanrove za trending
        const trendingSubjects = ['fiction', 'romance', 'mystery', 'science fiction', 'fantasy']
        const randomSubject = trendingSubjects[Math.floor(Math.random() * trendingSubjects.length)]

        const result = await searchBooksBySubject(randomSubject, 1, limit)

        if (result.success) {
            return {
                success: true,
                data: {
                    books: formatBooksData(result.data.books),
                    subject: randomSubject
                }
            }
        }

        return result
    } catch (error) {
        console.error('Error getting trending books:', error.message)
        return {
            success: false,
            error: 'Failed to get trending books'
        }
    }
}

module.exports = {
    searchBooks,
    searchBooksByTitle,
    searchBooksByAuthor,
    searchBooksBySubject,
    getBookDetails,
    getBookEditions,
    getCoverImageUrl,
    getCoverImageUrlByISBN,
    formatBookData,
    formatBooksData,
    getTrendingBooks
}
