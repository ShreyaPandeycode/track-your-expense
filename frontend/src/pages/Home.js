import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import ExpenseTable from './ExpenseTable';
import ExpenseForm from './ExpenseForm';
import ExpenseDetails from './ExpenseDetails';

function Home() {
  const [loggedInUser, setLoggedInUser] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [incomeAmt, setIncomeAmt] = useState(0);
  const [expenseAmt, setExpenseAmt] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('Logged out successfully!');
    setTimeout(() => navigate('/login'), 800);
  };

  // Calculate total income and expenses
  useEffect(() => {
    const amounts = expenses.map(item => item.amount);
    const income = amounts.filter(a => a > 0).reduce((a, b) => a + b, 0);
    const expense = amounts.filter(a => a < 0).reduce((a, b) => a + b, 0) * -1;
    setIncomeAmt(income);
    setExpenseAmt(expense);
  }, [expenses]);

  // Fetch expenses
  const fetchExpenses = useCallback(async () => {
    try {
      const res = await fetch(`${APIUrl}/expenses`, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      if (res.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      const result = await res.json();
      setExpenses(result.data);
    } catch (err) {
      handleError(err);
    }
  }, [navigate]);

const addTransaction = async (data) => {
  console.log('Form data received:', data); // Log the data from ExpenseForm
  const token = localStorage.getItem('token');
  console.log('Token status:', token ? 'Present' : 'Missing');
  try {
    const res = await fetch(`${APIUrl}/expenses`, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    console.log('Response status:', res.status); // Log HTTP status
    const result = await res.json();
    console.log('API response:', result); // Log server response
    if (res.status === 403) {
      console.log('Invalid token, redirecting to login');
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }
    handleSuccess(result.message);
    setExpenses(result.data); // Update expenses with new data
    setShowForm(false);
  } catch (err) {
    console.error('Error:', err); // Log any errors
    handleError(err.message || 'Failed to add transaction');
  }
};

  const deleteExpense = async (id) => {
    try {
      const res = await fetch(`${APIUrl}/expenses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: localStorage.getItem('token') },
      });
      if (res.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      const result = await res.json();
      handleSuccess(result.message);
      setExpenses(result.data);
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <h1 className="welcome-text">Hello, {loggedInUser}</h1>
        <div>
          <button className="btn-primary" onClick={() => setShowForm(true)}>+ Add Transaction</button>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* Dashboard Cards */}
      <div className="dashboard-grid">
        <div className="dashboard-card income-card">
          <h3>Income</h3>
          <p className="amount">₹{incomeAmt}</p>
        </div>
        <div className="dashboard-card expense-card">
          <h3>Expenses</h3>
          <p className="amount">₹{expenseAmt}</p>
        </div>
        <div className="dashboard-card balance-card">
          <h3>Balance</h3>
          <p className="amount">₹{incomeAmt - expenseAmt}</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="transactions-container">
        <h2>Recent Transactions</h2>
        <ExpenseTable expenses={expenses} deleteExpens={deleteExpense} />
      </div>

      {/* Floating Modal Form */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <ExpenseForm addTransaction={addTransaction} />
            <button className="btn-close" onClick={() => setShowForm(false)}>X</button>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Home;

