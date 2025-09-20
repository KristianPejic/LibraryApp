// backend/src/routes/customBooks.js

const express = require('express');
const router = express.Router();
const customBooksController = require('../controllers/customBooksController');

// GET /api/custom-books - Get all custom books
router.get('/', customBooksController.getCustomBooks);

// POST /api/custom-books - Create a new custom book
router.post('/', customBooksController.createCustomBook);

// GET /api/custom-books/:id - Get a specific custom book
router.get('/:id', customBooksController.getCustomBook);

// PUT /api/custom-books/:id - Update a custom book
router.put('/:id', customBooksController.updateCustomBook);

// DELETE /api/custom-books/:id - Delete a custom book
router.delete('/:id', customBooksController.deleteCustomBook);

module.exports = router;