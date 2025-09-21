const pool = require('../config/database');

/**
 * Custom Books Controller
 * Handles CRUD operations for user's custom books using MySQL database
 */

// GET /api/custom-books - Get all custom books
const getCustomBooks = async (req, res) => {
    try {
        const [books] = await pool.execute(
            'SELECT * FROM custom_books ORDER BY created_date DESC'
        );

        // Format the response to match frontend expectations
        const formattedBooks = books.map(book => ({
            id: book.id,
            title: book.title,
            authors: book.authors ? JSON.parse(book.authors) : ['Unknown Author'],
            publishYear: book.publish_year,
            genre: book.genre,
            description: book.description,
            status: book.status,
            isCustom: true,
            createdDate: book.created_date,
            updatedDate: book.updated_date
        }));

        res.json({
            success: true,
            data: {
                books: formattedBooks,
                count: formattedBooks.length
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
        const { title, authors, publishYear, genre, description, status = 'want-to-read' } = req.body;

        console.log('Creating custom book with data:', req.body);

        // Validation
        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                error: 'Title is required'
            });
        }

        // Generate custom ID
        const customId = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Prepare authors array
        let authorsArray = [];
        if (Array.isArray(authors)) {
            authorsArray = authors.filter(author => author && author.trim());
        } else if (authors && typeof authors === 'string') {
            authorsArray = [authors.trim()];
        }

        if (authorsArray.length === 0) {
            authorsArray = ['Unknown Author'];
        }

        // Insert into database
        const [result] = await pool.execute(
            `INSERT INTO custom_books 
             (id, title, authors, publish_year, genre, description, status, created_date, updated_date) 
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
                customId,
                title.trim(),
                JSON.stringify(authorsArray),
                publishYear || null,
                genre || null,
                description || null,
                status
            ]
        );

        // Fetch the created book
        const [createdBook] = await pool.execute(
            'SELECT * FROM custom_books WHERE id = ?',
            [customId]
        );

        if (createdBook.length === 0) {
            throw new Error('Failed to retrieve created book');
        }

        // Format the response
        const book = createdBook[0];
        const formattedBook = {
            id: book.id,
            title: book.title,
            authors: JSON.parse(book.authors),
            publishYear: book.publish_year,
            genre: book.genre,
            description: book.description,
            status: book.status,
            isCustom: true,
            createdDate: book.created_date,
            updatedDate: book.updated_date
        };

        console.log('Successfully created custom book:', formattedBook);

        res.status(201).json({
            success: true,
            data: {
                book: formattedBook
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
        const { title, authors, publishYear, genre, description, status } = req.body;

        console.log('Updating custom book:', id, 'with data:', req.body);

        // Check if book exists
        const [existingBook] = await pool.execute(
            'SELECT * FROM custom_books WHERE id = ?',
            [id]
        );

        if (existingBook.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        // Prepare update data
        const updates = {};
        if (title !== undefined) updates.title = title.trim();
        if (authors !== undefined) {
            let authorsArray = Array.isArray(authors) ? authors : [authors];
            authorsArray = authorsArray.filter(author => author && author.trim());
            if (authorsArray.length === 0) authorsArray = ['Unknown Author'];
            updates.authors = JSON.stringify(authorsArray);
        }
        if (publishYear !== undefined) updates.publish_year = publishYear || null;
        if (genre !== undefined) updates.genre = genre || null;
        if (description !== undefined) updates.description = description || null;
        if (status !== undefined) updates.status = status;

        // Build dynamic UPDATE query
        const updateFields = Object.keys(updates);
        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No valid fields to update'
            });
        }

        const setClause = updateFields.map(field => `${field} = ?`).join(', ');
        const values = updateFields.map(field => updates[field]);
        values.push(id); // for WHERE clause

        await pool.execute(
            `UPDATE custom_books SET ${setClause}, updated_date = NOW() WHERE id = ?`,
            values
        );

        // Fetch updated book
        const [updatedBook] = await pool.execute(
            'SELECT * FROM custom_books WHERE id = ?',
            [id]
        );

        const book = updatedBook[0];
        const formattedBook = {
            id: book.id,
            title: book.title,
            authors: JSON.parse(book.authors),
            publishYear: book.publish_year,
            genre: book.genre,
            description: book.description,
            status: book.status,
            isCustom: true,
            createdDate: book.created_date,
            updatedDate: book.updated_date
        };

        res.json({
            success: true,
            data: {
                book: formattedBook
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

        console.log('Deleting custom book:', id);

        // Check if book exists
        const [existingBook] = await pool.execute(
            'SELECT * FROM custom_books WHERE id = ?',
            [id]
        );

        if (existingBook.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        // Delete the book
        await pool.execute(
            'DELETE FROM custom_books WHERE id = ?',
            [id]
        );

        // Format the deleted book data
        const book = existingBook[0];
        const formattedBook = {
            id: book.id,
            title: book.title,
            authors: JSON.parse(book.authors),
            publishYear: book.publish_year,
            genre: book.genre,
            description: book.description,
            status: book.status,
            isCustom: true,
            createdDate: book.created_date,
            updatedDate: book.updated_date
        };

        res.json({
            success: true,
            data: {
                book: formattedBook
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

        const [book] = await pool.execute(
            'SELECT * FROM custom_books WHERE id = ?',
            [id]
        );

        if (book.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        // Format the response
        const bookData = book[0];
        const formattedBook = {
            id: bookData.id,
            title: bookData.title,
            authors: JSON.parse(bookData.authors),
            publishYear: bookData.publish_year,
            genre: bookData.genre,
            description: bookData.description,
            status: bookData.status,
            isCustom: true,
            createdDate: bookData.created_date,
            updatedDate: bookData.updated_date
        };

        res.json({
            success: true,
            data: {
                book: formattedBook
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