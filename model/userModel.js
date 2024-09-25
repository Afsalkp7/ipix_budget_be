import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const IncomeSchema = new Schema({
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    description: {
        type: String,
        trim: true,
    }
}); // Disable _id generation for sub-documents

const ExpenseSchema = new Schema({
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    description: {
        type: String,
        trim: true,
    }
}); // Disable _id generation for sub-documents

const UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
    },
    income: [IncomeSchema],  // Array of income entries
    expense: [ExpenseSchema]  // Array of expense entries
});

export default mongoose.model('User', UserSchema);
