import React, { useState } from 'react';
import api from '../api/axios';
import './Reports.css';

const Reports = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [reportGenerated, setReportGenerated] = useState(false);

    const generateReport = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get('http://localhost:8080/api/loans/active');

            const loansWithFees = await Promise.all(
                response.data.map(async loan => {
                    try {
                        const feeResponse = await api.get(
                            `http://localhost:8080/api/loans/${loan.loanId}/late-fee`
                        );
                        return {
                            ...loan,
                            lateFee: feeResponse.data
                        };
                    } catch (feeError) {
                        console.error('Error calculating late fee for loan', loan.loanId, feeError);
                        return {
                            ...loan,
                            lateFee: 0
                        };
                    }
                })
            );

            setLoans(loansWithFees);
            setReportGenerated(true);
        } catch (err) {
            setError('Failed to generate report. Please try again.');
            console.error('Report generation error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reports-container">
            <h2>Library Reports</h2>

            <button
                onClick={generateReport}
                disabled={loading}
                className="generate-report-button"
            >
                {loading ? 'Generating Report...' : 'Generate Report'}
            </button>

            {error && <div className="error-message">{error}</div>}

            {reportGenerated && (
                <div className="report-results">
                    <h3>Current Loans Report</h3>
                    <table className="report-table">
                        <thead>
                        <tr>
                            <th>Member</th>
                            <th>Book</th>
                            <th>Checkout Date</th>
                            <th>Due Date</th>
                            <th>Late Fees</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loans.length > 0 ? (
                            loans.map(loan => (
                                <tr key={loan.loanId}>
                                    <td>{loan.member?.name || 'N/A'}</td>
                                    <td>
                                        {loan.book?.title || 'N/A'}
                                        {loan.book?.type && ` (${loan.book.type})`}
                                    </td>
                                    <td>{loan.checkOutDate || 'N/A'}</td>
                                    <td>{loan.dueDate || 'N/A'}</td>
                                    <td>${loan.lateFee?.toFixed(2) || '0.00'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="no-results">
                                    No active loans found
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Reports;