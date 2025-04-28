import React from 'react'
import axios from 'axios';

const API_URL = 'http://localhost:8080/api'

const BookService = {
    getAllBooks: () => axios.get(`${API_URL}/books`),
    getBookById: (id) => axios.get(`${API_URL}/books/${id}`),
    addBook: (book) => axios.post(`${API_URL}/books`, book),
    updateBook: (id, book) => axios.put(`${API_URL}/books/${id}`, book),
    deleteBook: (id) => axios.delete(`${API_URL}/books/${id}`)
};

export default BookService;
