import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../api/axios';
import './Books.css'; // We'll create this next

const Books = () => {
    const [books, setBooks] = useState([]); // State to store the list of books

    // Fetch books from the database on component mount
    useEffect(() => {
        fetchBooks();
    }, []);

    // Function to fetch books
    const fetchBooks = async () => {
        try {
            const response = await api.get('http://localhost:8080/api/books');
            setBooks(response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    // Form validation schema
    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
        author: Yup.string().required('Author is required'),
        type: Yup.string().required('Type is required'),
    });

    // Function to handle form submission
    const handleSubmit = async (values, { resetForm }) => {
        try {
            await api.post('http://localhost:8080/api/books', values);
            fetchBooks();
            resetForm();
        } catch (error) {
            console.error('Error adding book:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`http://localhost:8080/api/books/${id}`);
            fetchBooks();
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    return (
        <div className="books">
            <h1>Library Management System</h1>

            {/* Add Book Module */}
            <div className="add-book-module">
                <h2>Add a New Book</h2>
                <Formik
                    initialValues={{ title: '', author: '', type: 'Fiction' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    <Form>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <Field type="text" id="title" name="title" />
                            <ErrorMessage name="title" component="div" className="error" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="author">Author</label>
                            <Field type="text" id="author" name="author" />
                            <ErrorMessage name="author" component="div" className="error" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="type">Type</label>
                            <Field as="select" id="type" name="type">
                                <option value="Fiction">Fiction</option>
                                <option value="Non-Fiction">Non-Fiction</option>
                            </Field>
                            <ErrorMessage name="type" component="div" className="error" />
                        </div>
                        <button type="submit">Add Book</button>
                    </Form>
                </Formik>
            </div>

            {/* Book List Module */}
            <div className="book-list-module">
                <h2>Book List</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Type</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {books.map((book) => (
                        <tr key={book.bookId}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.type}</td>
                            <td>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(book.bookId)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Books;