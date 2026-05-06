import mongoose from 'mongoose';
import { EXPENSE_CATEGORIES } from '../constants/enums.js';

const expenseSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: Object.values(EXPENSE_CATEGORIES),
      required: [true, 'Please specify expense category'],
    },
    description: {
      type: String,
      required: [true, 'Please provide description'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please provide amount'],
      min: [0, 'Amount cannot be negative'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide date'],
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster queries
expenseSchema.index({ category: 1, date: 1 });

export const Expense = mongoose.model('Expense', expenseSchema);
