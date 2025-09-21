import apiClient from './api'

const STORAGE_KEY = 'userLibrary';

/**
 * Get all books from user's library (localStorage for non-custom books)
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
 * Save user library to localStorage (for non-custom books only)
 */
export const saveUserLibrary = (library) => {
  try {
    // Only save non-custom books to localStorage
    const nonCustomBooks = library.filter(book => !book.isCustom);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nonCustomBooks));
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
    console.log('Creating custom book:', bookData);

    const response = await apiClient.post('/custom-books', {
      title: bookData.title,
      authors: Array.isArray(bookData.authors) ? [...bookData.authors] : bookData.authors,
      publishYear: bookData.publishYear,
      genre: bookData.genre,
      description: bookData.description,
      status: bookData.status || 'want-to-read'
    });

    console.log('API Response:', response.data);

    if (response.data.success) {
      return { success: true, book: response.data.data.book };
    } else {
      throw new Error(response.data.error || 'Failed to create book');
    }
  } catch (error) {
    console.error('Error creating custom book:', error);

    // Return the error details for better debugging
    if (error.response) {
      throw new Error(`Server error: ${error.response.data?.error || error.response.statusText}`);
    } else if (error.request) {
      throw new Error('Network error - could not connect to server');
    } else {
      throw new Error(error.message || 'Failed to create custom book');
    }
  }
};

/**
 * Update an existing book
 */
export const updateBook = async (bookOrId, updates) => {
  try {
    const bookId = typeof bookOrId === 'object' && bookOrId !== null ? bookOrId.id : bookOrId;
    const customFlag = typeof bookOrId === 'object' && bookOrId !== null
      ? (bookOrId.isCustom === true || bookOrId.is_custom === true)
      : (typeof bookId === 'number' ? true : (typeof bookId === 'string' ? bookId.startsWith('custom_') : false));

    if (customFlag) {
      // Update custom book via API
      const response = await apiClient.put(`/custom-books/${bookId}`, updates);

      if (response.data.success) {
        return { success: true, book: response.data.data.book };
      } else {
        throw new Error(response.data.error || 'Failed to update book');
      }
    } else {
      // Update non-custom book in localStorage
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

      if (saveUserLibrary(library)) {
        return { success: true, book: library[bookIndex] };
      } else {
        throw new Error('Failed to save to localStorage');
      }
    }
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

/**
 * Remove a book from the library
 */
export const removeBook = async (bookOrId) => {
  try {
    const bookId = typeof bookOrId === 'object' && bookOrId !== null ? bookOrId.id : bookOrId;
    const customFlag = typeof bookOrId === 'object' && bookOrId !== null
      ? (bookOrId.isCustom === true || bookOrId.is_custom === true)
      : (typeof bookId === 'number' ? true : (typeof bookId === 'string' ? bookId.startsWith('custom_') : false));

    if (customFlag) {
      // Delete custom book via API
      const response = await apiClient.delete(`/custom-books/${bookId}`);

      if (response.data.success) {
        return { success: true };
      } else {
        throw new Error(response.data.error || 'Failed to delete book');
      }
    } else {
      // Remove non-custom book from localStorage
      const library = getUserLibrary();
      const filteredLibrary = library.filter(book => book.id !== bookId);

      if (saveUserLibrary(filteredLibrary)) {
        return { success: true };
      } else {
        throw new Error('Failed to save to localStorage');
      }
    }
  } catch (error) {
    console.error('Error removing book:', error);
    throw error;
  }
};

/**
 * Get all custom books from API
 */
export const getAllCustomBooks = async () => {
  try {
    console.log('Fetching custom books from API...');

    const response = await apiClient.get('/custom-books');
    console.log('Custom books API response:', response.data);

    if (response.data.success) {
      return { success: true, books: response.data.data.books || [] };
    } else {
      throw new Error(response.data.error || 'Failed to fetch custom books');
    }
  } catch (error) {
    console.error('Error fetching custom books from API:', error);

    // Don't fallback to localStorage for custom books - they should come from API
    throw error;
  }
};

/**
 * Get all books (custom from API + non-custom from localStorage)
 */
export const getAllBooks = async () => {
  try {
    // Get custom books from API
    const customBooksResult = await getAllCustomBooks();
    const customBooks = customBooksResult.success ? customBooksResult.books : [];

    // Get non-custom books from localStorage
    const localBooks = getUserLibrary();

    // Combine both lists
    const allBooks = [...customBooks, ...localBooks];

    return { success: true, books: allBooks };
  } catch (error) {
    console.error('Error getting all books:', error);

    // If API fails, return only localStorage books
    const localBooks = getUserLibrary();
    return { success: true, books: localBooks };
  }
};

/**
 * Get books by status (from both API and localStorage)
 */
export const getBooksByStatus = async (status) => {
  try {
    const allBooksResult = await getAllBooks();
    const allBooks = allBooksResult.books || [];

    return allBooks.filter(book => book.status === status);
  } catch (error) {
    console.error('Error getting books by status:', error);
    return [];
  }
};

/**
 * Get custom books only
 */
export const getCustomBooks = async () => {
  try {
    const result = await getAllCustomBooks();
    return result.books || [];
  } catch (error) {
    console.error('Error getting custom books:', error);
    return [];
  }
};

/**
 * Check if a book exists in the library
 */
export const isBookInLibrary = async (bookId) => {
  try {
    const allBooksResult = await getAllBooks();
    const allBooks = allBooksResult.books || [];

    return allBooks.some(book => book.id === bookId);
  } catch (error) {
    console.error('Error checking if book is in library:', error);
    return false;
  }
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
export const getLibraryStats = async () => {
  try {
    const allBooksResult = await getAllBooks();
    const library = allBooksResult.books || [];

    return {
      total: library.length,
      wantToRead: library.filter(book => book.status === 'want-to-read').length,
      currentlyReading: library.filter(book => book.status === 'currently-reading').length,
      read: library.filter(book => book.status === 'read').length,
      custom: library.filter(book => book.isCustom === true).length
    };
  } catch (error) {
    console.error('Error getting library stats:', error);
    return {
      total: 0,
      wantToRead: 0,
      currentlyReading: 0,
      read: 0,
      custom: 0
    };
  }
};

// Legacy aliases for compatibility
export const deleteCustomBook = removeBook;
export const updateCustomBook = updateBook;
export const getCustomBook = async (bookId) => {
  try {
    if (bookId.startsWith('custom_')) {
      const response = await apiClient.get(`/custom-books/${bookId}`);
      if (response.data.success) {
        return { success: true, book: response.data.data.book };
      }
    }
    return { success: false, error: 'Book not found' };
  } catch (error) {
    console.error('Error getting custom book:', error);
    return { success: false, error: error.message };
  }
};

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
  getAllBooks,
  getCustomBook,
  isBookInLibrary,
  addBookToLibrary,
  getLibraryStats
};
