import User from '../model/userModel.js';

export const addIncome = async (req, res) => {
    try {
        const { amount, category, date, description } = req.body;

        // Validate request body
        if (!amount || !category) {
            return res.status(402).json({ message: 'Amount and category are required.' });
        }

        // Create the income object
        const newIncome = {
            amount,
            category,
            date,
            description,
        };

        // Find the user and update their income array using the user ID from the middleware
        const user = await User.findByIdAndUpdate(
            req.user,
            { $push: { income: newIncome } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'Income added successfully!', income: newIncome });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const showIncome = async (req, res) =>{
    try {
        // Find the user by ID (from the auth middleware)
        const user = await User.findById(req.user).select('income'); // Only select the income field

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Return the user's income records
        res.status(200).json({ income: user.income });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
}

export const updateIncome = async (req, res) => {
    const {  incomeId } = req.params; // Extract userId and incomeId from request params
    const { amount, category, date, description } = req.body; // Extract updated fields from the request body
    const userId = req.user
    try {
      // Find the user by userId
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Find the income by incomeId within the user's income array
      const income = user.income.id(incomeId);
  
      if (!income) {
        return res.status(404).json({ message: 'Income entry not found' });
      }
  
      // Update the income entry fields
      income.amount = amount;
      income.category = category;
      income.date = date;
      income.description = description;
  
      // Save the updated user document
      await user.save();
  
      // Send success response
      res.status(200).json({
        message: 'Income updated successfully',
        income,
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

  export const deleteIncome = async (req, res) => {
    const { incomeId } = req.params; // Expecting userId and incomeId from the request params
    const userId = req.user
    try {
      // Find the user by ID and remove the income entry
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Filter out the income entry that matches the provided incomeId
      user.income = user.income.filter(income => income._id.toString() !== incomeId);
  
      // Save the updated user document
      await user.save();
  
      return res.status(200).json({ message: 'Income deleted successfully', income: user.income });
    } catch (error) {
      console.error('Error deleting income:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };