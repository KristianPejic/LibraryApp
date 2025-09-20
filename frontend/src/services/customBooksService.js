/**
 * Custom Books Service
 * Handles CRUD operations for user's custom books
 * Integrates with both API and localStorage
 */

import apiClient from './api'

const STORAGE_KEY = 'userLibrary';

/**
 * Get all books from user's library
 */
export const getUserLibrary = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading user library:', error);
    return [];
  }
};

/**
 * Save user library to localStorage
 */
export const saveUserLibrary = (library) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
    return true;
  } catch (error) {
    console.error('Error saving user library:', error);
    return false;
  }
};

/**
 * Create a new custom book via API
 */
export const createCustomBook = async (bookData) => {
  try {
    // Try API first
    const response = await apiClient.post('/custom-books', bookData);

    if (response.data.success) {
      // Also save to localStorage for offline access
      const library = getUserLibrary();
      const newBook = {
        ...response.data.data.book,
        addedDate: new Date().toISOString()
      };
      library.push(newBook);
      saveUserLibrary(library);

      return { success: true, book: newBook };
    } else {
      throw new Error(response.data.error || 'Failed to create book');
    }
  } catch (error) {
    console.error('API error, falling back to localStorage:', error);

    // Fallback to localStorage if API fails
    const library = getUserLibrary();

    const newBook = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...bookData,
      isCustom: true,
      status: bookData.status || 'want-to-read',
      addedDate: new Date().toISOString(),
      coverUrl: bookData.coverUrl || null
    };

    library.push(newBook);

    if (saveUserLibrary(library)) {
      return { success: true, book: newBook };
    } else {
      throw new Error('Failed to save to localStorage');
    }
  }
};

/**
 * Update an existing book
 */
export const updateBook = async (bookId, updates) => {
  try {
    // Try API first for custom books
    if (bookId.startsWith('custom_')) {
      try {
        const response = await apiClient.put(`/custom-books/${bookId}`, updates);
        if (response.data.success) {
          // Update localStorage as well
          const library = getUserLibrary();
          const bookIndex = library.findIndex(book => book.id === bookId);
          if (bookIndex !== -1) {
            library[bookIndex] = { ...library[bookIndex], ...updates, updatedDate: new Date().toISOString() };
            saveUserLibrary(library);
          }
          return { success: true, book: response.data.data.book };
        }
      } catch (apiError) {
        console.warn('API update failed, falling back to localStorage:', apiError);
      }
    }

    // Fallback to localStorage
    const library = getUserLibrary();
    const bookIndex = library.findIndex(book => book.id === bookId);

    if (bookIndex === -1) {
      throw new Error('Book not found');
    }

    library[bookIndex] = {
      ...library[bookIndex],
      ...updates,
      updatedDate: new Date().toISOString()
    };

    // Add completion date if marked as read
    if (updates.status === 'read' && library[bookIndex].status !== 'read') {
      library[bookIndex].completedDate = new Date().toISOString();
    }

    if (saveUserLibrary(library)) {
      return { success: true, book: library[bookIndex] };
    } else {
      throw new Error('Failed to save to localStorage');
    }
  } catch (error) {
    console.error('Error updating book:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Remove a book from the library
 */
export const removeBook = async (bookId) => {
  try {
    // Try API first for custom books
    if (bookId.startsWith('custom_')) {
      try {
        const response = await apiClient.delete(`/custom-books/${bookId}`);
        if (response.data.success) {
          // Remove from localStorage as well
          const library = getUserLibrary();
          const filteredLibrary = library.filter(book => book.id !== bookId);
          saveUserLibrary(filteredLibrary);
          return { success: true };
        }
      } catch (apiError) {
        console.warn('API delete failed, falling back to localStorage:', apiError);
      }
    }

    // Fallback to localStorage
    const library = getUserLibrary();
    const originalLength = library.length;
    const filteredLibrary = library.filter(book => book.id !== bookId);

    if (filteredLibrary.length === originalLength) {
      throw new Error('Book not found');
    }

    if (saveUserLibrary(filteredLibrary)) {
      return { success: true };
    } else {
      throw new Error('Failed to save to localStorage');
    }
  } catch (error) {
    console.error('Error removing book:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a custom book (alias for removeBook for API compatibility)
 */
export const deleteCustomBook = async (bookId) => {
  return await removeBook(bookId);
};

/**
 * Get books by status
 */
export const getBooksByStatus = (status) => {
  const library = getUserLibrary();
  return library.filter(book => book.status === status);
};

/**
 * Get custom books only
 */
export const getCustomBooks = () => {
  const library = getUserLibrary();
  return library.filter(book => book.isCustom === true);
};

/**
 * Check if a book exists in the library
 */
export const isBookInLibrary = (bookId) => {
  const library = getUserLibrary();
  return library.some(book => book.id === bookId);
};

/**
 * Add a book from external source (like Open Library) to user's library
 */
export const addBookToLibrary = (bookData, status = 'want-to-read') => {
  try {
    const library = getUserLibrary();

    // Check if book already exists
    if (library.some(book => book.id === bookData.id)) {
      return { success: false, error: 'Book already in library' };
    }

    const newBook = {
      id: bookData.id,
      title: bookData.title,
      authors: bookData.authors || ['Unknown Author'],
      publishYear: bookData.publishYear,
      coverUrl: bookData.coverUrl,
      status: status,
      addedDate: new Date().toISOString(),
      isCustom: false
    };

    library.push(newBook);

    if (saveUserLibrary(library)) {
      return { success: true, book: newBook };
    } else {
      throw new Error('Failed to save to localStorage');
    }
  } catch (error) {
    console.error('Error adding book to library:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get library statistics
 */
export const getLibraryStats = () => {
  const library = getUserLibrary();

  return {
    total: library.length,
    wantToRead: library.filter(book => book.status === 'want-to-read').length,
    currentlyReading: library.filter(book => book.status === 'currently-reading').length,
    read: library.filter(book => book.status === 'read').length,
    custom: library.filter(book => book.isCustom === true).length
  };
};

/**
 * Load custom books from API and merge with localStorage
 */
export const loadCustomBooksFromAPI = async () => {
  try {
    const response = await apiClient.get('/custom-books');

    if (response.data.success) {
      const apiBooks = response.data.data.books || [];

      // Merge with localStorage books
      const localBooks = getUserLibrary();
      const localCustomBooks = localBooks.filter(book => book.isCustom);

      // Combine API and local books (avoid duplicates)
      const allCustomBooks = [...apiBooks];
      localCustomBooks.forEach(localBook => {
        if (!apiBooks.find(apiBook => apiBook.id === localBook.id)) {
          allCustomBooks.push(localBook);
        }
      });

      return { success: true, books: allCustomBooks };
    } else {
      throw new Error(response.data.error || 'Failed to load custom books');
    }
  } catch (error) {
    console.error('Error loading custom books from API, using localStorage:', error);

    // Fallback to localStorage
    const localBooks = getUserLibrary();
    const customBooks = localBooks.filter(book => book.isCustom);

    return { success: true, books: customBooks };
  }
};

/**
 * Get a specific custom book by ID
 */
export const getCustomBook = async (bookId) => {
  try {
    // Try API first
    if (bookId.startsWith('custom_')) {
      try {
        const response = await apiClient.get(`/custom-books/${bookId}`);
        if (response.data.success) {
          return { success: true, book: response.data.data.book };
        }
      } catch (apiError) {
        console.warn('API get failed, falling back to localStorage:', apiError);
      }
    }

    // Fallback to localStorage
    const library = getUserLibrary();
    const book = library.find(book => book.id === bookId);

    if (book) {
      return { success: true, book };
    } else {
      return { success: false, error: 'Book not found' };
    }
  } catch (error) {
    console.error('Error getting custom book:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update custom book (alias for updateBook for API compatibility)
 */
export const updateCustomBook = async (bookId, updates) => {
  return await updateBook(bookId, updates);
};

/**
 * Get all custom books from API
 */
export const getAllCustomBooks = async () => {
  try {
    const response = await apiClient.get('/custom-books');

    if (response.data.success) {
      return { success: true, books: response.data.data.books || [] };
    } else {
      throw new Error(response.data.error || 'Failed to fetch custom books');
    }
  } catch (error) {
    console.error('Error fetching custom books from API:', error);

    // Fallback to localStorage
    const customBooks = getCustomBooks();
    return { success: true, books: customBooks };
  }
};

/**
 * Export default object with all functions
 */
export default {
  getUserLibrary,
  saveUserLibrary,
  createCustomBook,
  updateBook,
  updateCustomBook,
  removeBook,
  deleteCustomBook,
  getBooksByStatus,
  getCustomBooks,
  getAllCustomBooks,
  getCustomBook,
  isBookInLibrary,
  addBookToLibrary,
  getLibraryStats,
  loadCustomBooksFromAPI
};
