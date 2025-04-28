import React, { useState } from 'react';
import api from '../api/axios';
import './Search.css'

const Search = () => {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState({
        books: [],
        members: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const [booksResponse, membersResponse] = await Promise.all([
                api.get(`http://localhost:8080/api/books/search?query=${query}`),
                api.get(`http://localhost:8080/api/members/search?query=${query}`)
            ]);

            setSearchResults({
                books: booksResponse.data,
                members: membersResponse.data
            });
        } catch (err) {
            setError('Failed to perform search. Please try again.');
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-container">
            <h2>Library Search</h2>

            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search books or members..."
                    className="search-input"
                />
                <button type="submit" disabled={loading} className="search-button">
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {error && <div className="error-message">{error}</div>}

            {/* Display search results */}
            <div className="search-results">
                {/* Books results */}
                {searchResults.books.length > 0 && (
                    <div className="results-section">
                        <h3>Books</h3>
                        <ul className="results-list">
                            {searchResults.books.map(book => (
                                <li key={book.bookId} className="result-item">
                                    <div className="book-info">
                                        <strong>{book.title}</strong> by {book.author}
                                        {book.type && <span> ({book.type})</span>}
                                    </div>
                                    <div className="additional-info">
                                        Status: {book.checkedOut ? 'Checked Out' : 'Available'}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Members results */}
                {searchResults.members.length > 0 && (
                    <div className="results-section">
                        <h3>Members</h3>
                        <ul className="results-list">
                            {searchResults.members.map(member => (
                                <li key={member.memberId} className="result-item">
                                    <div className="member-info">
                                        <strong>{member.name}</strong>
                                    </div>
                                    <div className="additional-info">
                                        Email: {member.email} | Phone: {member.phone || 'N/A'}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* No results message */}
                {!loading && query && searchResults.books.length === 0 && searchResults.members.length === 0 && (
                    <div className="no-results"></div>
                )}
            </div>
        </div>
    );
};

export default Search;