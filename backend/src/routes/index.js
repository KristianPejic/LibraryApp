const express = require('express')
const router = express.Router()

// Import route modules
const booksRoutes = require('./books')
const usersRoutes = require('./users')

// Use route modules
router.use('/books', booksRoutes)
router.use('/users', usersRoutes)

// API info route
router.get('/', (req, res) => {
    res.json({
        message: 'Book Library API',
        version: '1.0.0',
        endpoints: {
            books: '/api/books',
            users: '/api/users'
        }
    })
})

module.exports = router