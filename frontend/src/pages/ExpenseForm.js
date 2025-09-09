import React, { useState } from 'react';

function ExpenseForm({ addTransaction }) {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      amount: parseFloat(formData.amount),
    };
    console.log('Submitting:', data);
    addTransaction(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount" required />
      <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
      <input type="date" name="date" value={formData.date} onChange={handleChange} required />
      <button type="submit">Add Transaction</button>
    </form>
  );
}

export default ExpenseForm;