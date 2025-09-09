import React from 'react'

function ExpenseDetails({ incomeAmt, expenseAmt }) {
    const balance = incomeAmt - expenseAmt;
    const formatAmount = (amount) => new Intl.NumberFormat('en-IN').format(amount);

    return (
        <>
            <div className="balance-title">Your Current Balance</div>
            <div className="balance-amount">
                ₹{formatAmount(balance)}
            </div>
            <div className="balance-breakdown">
                <div className="income-info">
                    <div className="amount-label">Income</div>
                    <div className="income-amount">+₹{formatAmount(incomeAmt)}</div>
                </div>
                <div className="expense-info">
                    <div className="amount-label">Expenses</div>
                    <div className="expense-amount">-₹{formatAmount(expenseAmt)}</div>
                </div>
            </div>
        </>
    )
}

export default ExpenseDetails