const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  userId: { type: String, required: true },
});

module.exports = mongoose.model('Expense', expenseSchema);