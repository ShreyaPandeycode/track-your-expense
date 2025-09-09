import React from 'react';

const ExpenseTable = ({ expenses, deleteExpens }) => {
    const formatAmount = (amount) => new Intl.NumberFormat('en-IN').format(Math.abs(amount));
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { 
            day: 'numeric', 
            month: 'short',
            year: 'numeric'
        });
    };

    if (!expenses || expenses.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">📊</div>
                <h3>No transactions yet</h3>
                <p>Add your first transaction to get started tracking your expenses!</p>
            </div>
        );
    }

    return (
        <div className="expense-list">
            {expenses.map((expense, index) => (
                <div key={expense._id || index} className="expense-item">
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <div className="expense-description">{expense.text}</div>
                        {expense.createdAt && (
                            <small style={{ color: '#6c757d', fontSize: '12px', marginTop: '4px' }}>
                                {formatDate(expense.createdAt)}
                            </small>
                        )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div
                            className={`expense-amount ${expense.amount > 0 ? 'positive' : 'negative'}`}
                        >
                            {expense.amount > 0 ? '+' : '-'}₹{formatAmount(expense.amount)}
                        </div>
                        <button 
                            className="delete-button" 
                            onClick={() => deleteExpens(expense._id)}
                            title="Delete transaction"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ExpenseTable;
