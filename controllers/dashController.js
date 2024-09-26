import mongoose from 'mongoose'; // For ObjectId conversion
import User from '../model/userModel.js';

export const getDashData = async (req, res) => {
    try {
        const userId = req.user; // Assuming req.user.id contains the userId
        const currentDate = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(currentDate.getMonth() - 5); // Go back 5 months (to include current month)

        // Aggregate the income data
        const incomeData = await User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(userId) } }, // Match the user by ID
            { $unwind: "$income" }, // Unwind the income array
            {
                $match: {
                    "income.date": { $gte: sixMonthsAgo } // Filter for the last 6 months
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$income.date" }, // Group by month
                        year: { $year: "$income.date" }    // Group by year
                    },
                    totalIncome: { $sum: "$income.amount" } // Sum the income amounts
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year and month in ascending order
            }
        ]);

        // Aggregate the expense data
        const expenseData = await User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(userId) } }, // Match the user by ID
            { $unwind: "$expense" }, // Unwind the expense array
            {
                $match: {
                    "expense.date": { $gte: sixMonthsAgo } // Filter for the last 6 months
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$expense.date" }, // Group by month
                        year: { $year: "$expense.date" }    // Group by year
                    },
                    totalExpense: { $sum: "$expense.amount" } // Sum the expense amounts
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year and month in ascending order
            }
        ]);

        // Prepare arrays to store income and expense data for the last 6 months
        const income = new Array(6).fill(0); // Initialize array for 6 months with 0s for income
        const expense = new Array(6).fill(0); // Initialize array for 6 months with 0s for expenses
        const labels = [];

        // Get the current month (1-12)
        const currentMonth = currentDate.getMonth(); // 0-indexed month

        // Generate labels for the last 6 months
        for (let i = 5; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentMonth - i);
            const monthName = date.toLocaleString('default', { month: 'long' });
            labels.push(monthName);
        }

        // Map income data to the correct month index
        incomeData.forEach(item => {
            const date = new Date(item._id.year, item._id.month - 1); // Create date from year and month
            const index = (currentMonth - date.getMonth() + 12) % 12; // Calculate month difference, handle wrap-around
            if (index < 6) {
                income[5 - index] = item.totalIncome; // Fill the correct index for income
            }
        });

        // Map expense data to the correct month index
        expenseData.forEach(item => {
            const date = new Date(item._id.year, item._id.month - 1); // Create date from year and month
            const index = (currentMonth - date.getMonth() + 12) % 12; // Calculate month difference, handle wrap-around
            if (index < 6) {
                expense[5 - index] = item.totalExpense; // Fill the correct index for expenses
            }
        });

        // Return the income, expense, and label data for the last 6 months
        
        
        return res.status(200).json({ labels, income, expense });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


export const getDashboardOverview = async (req, res) => {
    try {
        const userId = req.user; // Assuming req.user contains the user ID

        // Find the user by ID and select only the income and expenses fields
        const user = await User.findById(userId).select('income expense');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        
        // Ensure income and expenses are arrays, defaulting to an empty array if undefined
        const incomeArray = user.income || [];
        const expensesArray = user.expense || [];
        
        
        // Calculate total income
        const totalIncome = incomeArray.reduce((acc, incomeItem) => acc + incomeItem.amount, 0);

        // Calculate total expenses
        const totalExpenses = expensesArray.reduce((acc, expenseItem) => acc + expenseItem.amount, 0);

        // Calculate remaining budget
        const remainingBudget = totalIncome - totalExpenses;

        // Return the overview data as a response
        return res.status(200).json({
            totalIncome,
            totalExpenses,
            remainingBudget
        });
    } catch (err) {
        console.error('Error getting dashboard overview:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};