const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
require('dotenv').config()

const app = express()

// Middleware
app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api', require('./routes'))

// Health check
app.get('/', (req, res) => {
    res.json({
        message: 'Book Library API is running!',
        version: '1.0.0'
    })
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    })
})

// 404 handler - PROMIJENIO SAM OVO!
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.path
    })
})

module.exports = app