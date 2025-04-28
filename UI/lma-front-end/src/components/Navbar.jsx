import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import {useAuth} from "../context/AuthContext";

const Navbar = () => {

    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li className="nav-item">
                    <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                    <Link to="/books" className="nav-link">Books</Link>
                </li>
                <li className="nav-item">
                    <Link to="/members" className="nav-link">Members</Link>
                </li>
                <li className="nav-item">
                    <Link to="/checkout" className="nav-link">Check Out</Link>
                </li>
                <li className="nav-item">
                    <Link to="/search" className="nav-link">Search</Link>
                </li>
                <li className="nav-item">
                    <Link to="/reports" className="nav-link">Reports</Link>
                </li>
            </ul>
            {user ? (
                <button onClick={logout}>Logout</button>
            ) : (
                <Link to="/login">Login</Link>
            )}
        </nav>
    );
};

export default Navbar;