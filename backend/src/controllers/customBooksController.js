// backend/src/controllers/customBooksController.js

/**
 * Custom Books Controller
 * Handles CRUD operations for user's custom books
 * Since we don't have a database, we'll simulate storage
 */

// In-memory storage for demo purposes
// In a real app, this would be a database
let customBooks = [];
let nextId = 1;

// GET /api/custom-books - Get all custom books
const getCustomBooks = async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                books: customBooks,
                count: customBooks.length
            }
        });
    } catch (error) {
        console.error('Get custom books error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch custom books'
        });
    }
};

// POST /api/custom-books - Create a new custom book
const createCustomBook = async (req, res) => {
    try {
        const { title, authors, publishYear, status = 'want-to-read' } = req.body;

        // Validation
        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                error: 'Title is required'
            });
        }

        const newBook = {
            id: `custom_${nextId++}`,
            title: title.trim(),
            authors: Array.isArray(authors) ? authors : (authors ? [authors] : ['Unknown Author']),
            publishYear: publishYear || null,
            status,
            isCustom: true,
            createdDate: new Date().toISOString(),
            updatedDate: new Date().toISOString()
        };

        customBooks.push(newBook);

        res.status(201).json({
            success: true,
            data: {
                book: newBook
            }
        });
    } catch (error) {
        console.error('Create custom book error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create custom book'
        });
    }
};

// PUT /api/custom-books/:id - Update a custom book
const updateCustomBook = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const bookIndex = customBooks.findIndex(book => book.id === id);

        if (bookIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        // Update the book
        customBooks[bookIndex] = {
            ...customBooks[bookIndex],
            ...updates,
            updatedDate: new Date().toISOString()
        };

        res.json({
            success: true,
            data: {
                book: customBooks[bookIndex]
            }
        });
    } catch (error) {
        console.error('Update custom book error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update custom book'
        });
    }
};

// DELETE /api/custom-books/:id - Delete a custom book
const deleteCustomBook = async (req, res) => {
    try {
        const { id } = req.params;

        const bookIndex = customBooks.findIndex(book => book.id === id);

        if (bookIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        const deletedBook = customBooks.splice(bookIndex, 1)[0];

        res.json({
            success: true,
            data: {
                book: deletedBook
            }
        });
    } catch (error) {
        console.error('Delete custom book error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete custom book'
        });
    }
};

// GET /api/custom-books/:id - Get a specific custom book
const getCustomBook = async (req, res) => {
    try {
        const { id } = req.params;

        const book = customBooks.find(book => book.id === id);

        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        res.json({
            success: true,
            data: {
                book
            }
        });
    } catch (error) {
        console.error('Get custom book error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch custom book'
        });
    }
};

module.exports = {
    getCustomBooks,
    createCustomBook,
    updateCustomBook,
    deleteCustomBook,
    getCustomBook
};