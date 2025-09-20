const openLibraryService = require('../services/openLibraryService')

// GET /api/books/search?q=query&page=1&limit=20
const searchBooks = async (req, res) => {
    try {
        const { q, page = 1, limit = 20, sort = 'relevance' } = req.query

        if (!q) {
            return res.status(400).json({
                success: false,
                error: 'Search query is required'
            })
        }

        const result = await openLibraryService.searchBooks(q, parseInt(page), parseInt(limit), sort)

        if (result.success) {
            // Format books data
            result.data.books = openLibraryService.formatBooksData(result.data.books)
        }

        res.json(result)
    } catch (error) {
        console.error('Search books error:', error)
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        })
    }
}

// GET /api/books/search/title?title=title&page=1&limit=20
const searchBooksByTitle = async (req, res) => {
    try {
        const { title, page = 1, limit = 20 } = req.query

        if (!title) {
            return res.status(400).json({
                success: false,
                error: 'Title is required'
            })
        }

        const result = await openLibraryService.searchBooksByTitle(title, parseInt(page), parseInt(limit))

        if (result.success) {
            result.data.books = openLibraryService.formatBooksData(result.data.books)
        }

        res.json(result)
    } catch (error) {
        console.error('Search books by title error:', error)
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        })
    }
}

// GET /api/books/search/author?author=author&page=1&limit=20
const searchBooksByAuthor = async (req, res) => {
    try {
        const { author, page = 1, limit = 20 } = req.query

        if (!author) {
            return res.status(400).json({
                success: false,
                error: 'Author is required'
            })
        }

        const result = await openLibraryService.searchBooksByAuthor(author, parseInt(page), parseInt(limit))

        if (result.success) {
            result.data.books = openLibraryService.formatBooksData(result.data.books)
        }

        res.json(result)
    } catch (error) {
        console.error('Search books by author error:', error)
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        })
    }
}

// GET /api/books/search/subject?subject=subject&page=1&limit=20
const searchBooksBySubject = async (req, res) => {
    try {
        const { subject, page = 1, limit = 20 } = req.query

        if (!subject) {
            return res.status(400).json({
                success: false,
                error: 'Subject is required'
            })
        }

        const result = await openLibraryService.searchBooksBySubject(subject, parseInt(page), parseInt(limit))

        if (result.success) {
            result.data.books = openLibraryService.formatBooksData(result.data.books)
        }

        res.json(result)
    } catch (error) {
        console.error('Search books by subject error:', error)
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        })
    }
}

// GET /api/books/details/:workId
const getBookDetails = async (req, res) => {
    try {
        const { workId } = req.params

        const result = await openLibraryService.getBookDetails(workId)

        res.json(result)
    } catch (error) {
        console.error('Get book details error:', error)
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        })
    }
}

// GET /api/books/trending
const getTrendingBooks = async (req, res) => {
    try {
        const { limit = 20 } = req.query

        const result = await openLibraryService.getTrendingBooks(parseInt(limit))

        res.json(result)
    } catch (error) {
        console.error('Get trending books error:', error)
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        })
    }
}

module.exports = {
    searchBooks,
    searchBooksByTitle,
    searchBooksByAuthor,
    searchBooksBySubject,
    getBookDetails,
    getTrendingBooks
}