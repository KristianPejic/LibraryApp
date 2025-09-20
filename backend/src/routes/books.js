const express = require('express')
const router = express.Router()
const bookController = require('../controllers/bookController')

// Search routes
router.get('/search', bookController.searchBooks)
router.get('/search/title', bookController.searchBooksByTitle)
router.get('/search/author', bookController.searchBooksByAuthor)
router.get('/search/subject', bookController.searchBooksBySubject)

// Book details
router.get('/details/:workId', bookController.getBookDetails)

// Trending books
router.get('/trending', bookController.getTrendingBooks)

// Legacy endpoint (za kompatibilnost)
router.get('/', (req, res) => {
    res.json({
        message: 'Books API endpoints',
        endpoints: {
            search: '/api/books/search?q=query&page=1&limit=20',
            searchByTitle: '/api/books/search/title?title=title',
            searchByAuthor: '/api/books/search/author?author=author',
            searchBySubject: '/api/books/search/subject?subject=subject',
            bookDetails: '/api/books/details/:workId',
            trending: '/api/books/trending'
        }
    })
})

module.exports = router