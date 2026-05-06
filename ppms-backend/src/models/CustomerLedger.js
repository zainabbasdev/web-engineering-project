import mongoose from 'mongoose';
import { TRANSACTION_TYPES } from '../constants/enums.js';

const transactionSchema = new mongoose.Schema(
  {
    transactionType: {
      type: String,
      enum: Object.values(TRANSACTION_TYPES),
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative'],
    },
    netBalance: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true, timestamps: false }
);

const customerLedgerSchema = new mongoose.Schema(
  {
    personName: {
      type: String,
      required: [true, 'Please provide customer name'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please provide phone number'],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    transactions: [transactionSchema],
  },
  { timestamps: true }
);

// Index for faster searches
customerLedgerSchema.index({ personName: 1 });
customerLedgerSchema.index({ phoneNumber: 1 });

export const CustomerLedger = mongoose.model('CustomerLedger', customerLedgerSchema);
