const express = require('express');
const router = express.Router();
const Expense = require('../Models/Expense');

router.post('/', async (req, res) => {
  try {
    const { amount, description, date } = req.body;
    const expense = new Expense({
      amount,
      description,
      date,
      userId: req.user.id, // Set by ensureAuthenticated
    });
    await expense.save();
    const expenses = await Expense.find({ userId: req.user.id });
    res.json({ message: 'Expense added', data: expenses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;