import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../api/axios';
import './Checkout.css';

const Checkout = () => {
    const [members, setMembers] = useState([]);
    const [books, setBooks] = useState([]);
    const [loans, setLoans] = useState([]);
    const [availableBooks, setAvailableBooks] = useState([]);

    useEffect(() => {
        fetchMembers();
        fetchBooks();
        fetchLoans();
        fetchAvailableBooks();
    }, []);

    const fetchMembers = async () => {
        try {
            const response = await api.get('http://localhost:8080/api/members');
            setMembers(response.data);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };

    const fetchAvailableBooks = async () => {
        try {
            const response = await api.get('http://localhost:8080/api/loans/available-books');
            setAvailableBooks(response.data);
        } catch (error) {
            console.error('Error fetching available books:', error);
        }
    };

    const fetchBooks = async () => {
        try {
            const response = await api.get('http://localhost:8080/api/books');
            setBooks(response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const fetchLoans = async () => {
        try {
            const response = await api.get('http://localhost:8080/api/loans');
            if (response.data) {
                setLoans(response.data);
            }
        } catch (error) {
            console.error('Error fetching loans:', error);
        }
    };

    const validationSchema = Yup.object({
        memberId: Yup.string().required('Member is required'),
        bookId: Yup.string().required('Book is required')
    });

    const handleReturn = async (loanId) => {
        try {
            await api.put(`http://localhost:8080/api/loans/${loanId}/return`);
            await Promise.all([fetchAvailableBooks(), fetchLoans()]);
        } catch (error) {
            console.error('Error returning book:', error);
        }
    };

    const handleDelete = async (loanId) => {
        if (window.confirm('Are you sure you want to delete this loan record?')) {
            try {
                await api.delete(`http://localhost:8080/api/loans/${loanId}`);
                fetchLoans();
            } catch (error) {
                console.error('Error deleting loan:', error);
            }
        }
    };

    return (
        <div className="checkout">
            <h1>Checkout System</h1>

            <div className="checkout-form">
                <h2>Check Out a Book</h2>
                <Formik
                    initialValues={{memberId: '', bookId: ''}}
                    validationSchema={Yup.object({
                        memberId: Yup.number()
                            .required('Member is required')
                            .positive('Invalid member selection'),
                        bookId: Yup.number()
                            .required('Book is required')
                            .positive('Invalid book selection')
                    })}
                    onSubmit={(values, {setSubmitting, resetForm}) => {
                        // Convert string values to numbers
                        const checkoutData = {
                            memberId: Number(values.memberId),
                            bookId: Number(values.bookId)
                        };

                        api.post('http://localhost:8080/api/loans', checkoutData)
                            .then(() => {
                                // Refresh data
                                fetchAvailableBooks();
                                fetchLoans();
                                resetForm();
                            })
                            .catch(error => {
                                console.error('Checkout failed:', error.response?.data || error.message);
                                alert('Checkout failed: ' + (error.response?.data || error.message));
                            })
                            .finally(() => {
                                setSubmitting(false);
                            });
                    }}
                >
                    {({isSubmitting}) => (
                        <Form>
                            <div className="form-group">
                                <label htmlFor="memberId">Member</label>
                                <Field
                                    as="select"
                                    id="memberId"
                                    name="memberId"
                                    className="form-select"
                                >
                                    <option value="">Select a member</option>
                                    {members.map(member => (
                                        <option key={member.memberId} value={member.memberId}>
                                            {member.name} ({member.email})
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name="memberId" component="div" className="error"/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="bookId">Book</label>
                                <Field
                                    as="select"
                                    id="bookId"
                                    name="bookId"
                                    className="form-select"
                                >
                                    <option value="">Select a book</option>
                                    {availableBooks.map(book => (
                                        <option key={book.bookId} value={book.bookId}>
                                            {book.title} by {book.author} ({book.type})
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name="bookId" component="div" className="error"/>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="submit-button" // Add this class for better styling
                            >
                                {isSubmitting ? 'Processing...' : 'Check Out'}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>

            <div className="loans-list">
                <h2>Loan History</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Member</th>
                        <th>Book</th>
                        <th>Checkout Date</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loans.map(loan => {
                        if (!loan || !loan.member || !loan.book) {
                            console.warn("Invalid loan data:", loan);
                            return null; // Skip rendering this row
                        }
                        return (
                            <tr key={loan.loanId}>
                                <td>{loan.member.name || 'N/A'}</td>
                                <td>{loan.book.title || 'N/A'} by {loan.book.author || 'N/A'}</td>
                                <td>{loan.checkOutDate || 'N/A'}</td>
                                <td>{loan.dueDate || 'N/A'}</td>
                                <td>{loan.returnDate ? 'Returned' : 'Checked Out'}</td>
                                <td>
                                    <div className="action-buttons">
                                        {!loan.returnDate && (
                                            <button
                                                className="return-button"
                                                onClick={() => handleReturn(loan.loanId)}
                                            >
                                                Return
                                            </button>
                                        )}
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDelete(loan.loanId)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Checkout;