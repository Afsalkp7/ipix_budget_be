import User from '../model/userModel.js';

// Add a new planning entry (income or expense)
export const addPlanning = async (req, res) => {
    const { type, category, amount, date, description } = req.body;
    const userId = req.user
    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newPlan = {
            type,
            category,
            amount,
            date,
            description
        };

        // Add the new plan to the user's planning array
        user.plan.push(newPlan);
        await user.save();
        
        
        
        return res.status(201).json({ message: 'Planning added successfully', plan: user.plan[user.plan.length-1] });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};


// Get all planning entries for a user
export const getAllPlannings = async (req, res) => {
    const userId = req.user;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return all planning entries (income & expense)
        return res.status(200).json({ plan: user.plan });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};


// Update a planning entry
export const updatePlanning = async (req, res) => {
    const { planId } = req.params;
    const { type, category, amount, date, description } = req.body;
    const userId = req.user
    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the specific planning entry by its ID
        const plan = user.plan.id(planId);
        if (!plan) {
            return res.status(404).json({ message: 'Planning entry not found' });
        }

        // Update the planning entry fields
        plan.type = type || plan.type;
        plan.category = category || plan.category;
        plan.amount = amount || plan.amount;
        plan.date = date || plan.date;
        plan.description = description || plan.description;

        await user.save();

        return res.status(200).json({ message: 'Planning updated successfully', plan });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};


// Delete a planning entry
export const deletePlanning = async (req, res) => {
    const { planId } = req.params;
    const userId = req.user; // Ensure req.user contains the authenticated user's ID
    
    try {
        // Fetch user by ID
        const user = await User.findById(userId);

        // Handle case where user is not found
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure user has plans
        if (!user.plan || user.plan.length === 0) {
            return res.status(404).json({ message: 'No plans found for user' });
        }

        // Use Mongoose's pull method to remove the plan from the user's plans
        const result = await User.findByIdAndUpdate(
            userId,
            { $pull: { plan: { _id: planId } } }, // Match the plan by its ID
            { new: true } // Return the updated user document
        );

        // Check if the update was successful
        if (!result) {
            return res.status(404).json({ message: 'Planning entry not found or not deleted' });
        }

        return res.status(200).json({ message: 'Planning deleted successfully' });
    } catch (error) {
        console.error('Error deleting planning:', error); // Optional: log for debugging
        return res.status(500).json({ message: 'Server error', error });
    }
};
