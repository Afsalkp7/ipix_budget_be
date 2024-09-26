import User from '../model/userModel.js';

export const addExpense = async (req, res) => {
    try {
        const { amount, category, date, description } = req.body;

        // Validate request body
        if (!amount || !category) {
            return res.status(402).json({ message: 'Amount and category are required.' });
        }

        // Create the expense object
        const newExpense = {
            amount,
            category,
            date,
            description,
        };

        // Find the user and update their expense array using the user ID from the middleware
        const user = await User.findByIdAndUpdate(
            req.user,
            { $push: { expense: newExpense } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'Expense added successfully!', expense: newExpense });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const showExpense = async (req, res) =>{
    try {
        // Find the user by ID (from the auth middleware)
        const user = await User.findById(req.user).select('expense'); // Only select the income field

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Return the user's income records
        res.status(200).json({ expense: user.expense });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
}

export const updateExpense = async (req, res) => {
    const {  expenseId } = req.params; // Extract userId and incomeId from request params
    const { amount, category, date, description } = req.body; // Extract updated fields from the request body
    const userId = req.user
    try {
      // Find the user by userId
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Find the income by incomeId within the user's income array
      const expense = user.expense.id(expenseId);
  
      if (!expense) {
        return res.status(404).json({ message: 'expense entry not found' });
      }
  
      // Update the income entry fields
      expense.amount = amount;
      expense.category = category;
      expense.date = date;
      expense.description = description;
  
      // Save the updated user document
      await user.save();
  
      // Send success response
      res.status(200).json({
        message: 'expense updated successfully',
        expense,
      });
    } catch (error) {
      // Handle any errors
      console.error('Error updating income:', error);
      res.status(500).json({
        message: 'Server error while updating income',
        error: error.message,
      });
    }
  };

  export const deleteExpense = async (req, res) => {
    const { expenseId } = req.params; // Expecting userId and incomeId from the request params
    const userId = req.user
    try {
      // Find the user by ID and remove the income entry
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Filter out the income entry that matches the provided incomeId
      user.expense = user.expense.filter(expense => expense._id.toString() !== expenseId);
  
      // Save the updated user document
      await user.save();
  
      return res.status(200).json({ message: 'expense deleted successfully', expense: user.expense });
    } catch (error) {
      console.error('Error deleting income:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };