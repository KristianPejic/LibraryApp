const express = require('express')
const router = express.Router()

// Import route modules
const booksRoutes = require('./books')
const usersRoutes = require('./users')
const customBooksRoutes = require('./customBooks')

// Use route modules
router.use('/books', booksRoutes)
router.use('/users', usersRoutes)
router.use('/custom-books', customBooksRoutes)

// API info route
router.get('/', (req, res) => {
    res.json({
        message: 'Book Library API',
        version: '1.0.0',
        endpoints: {
            books: '/api/books',
            users: '/api/users',
            customBooks: '/api/custom-books'
        }
    })
})

module.exports = router