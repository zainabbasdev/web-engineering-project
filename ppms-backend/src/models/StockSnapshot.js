import mongoose from 'mongoose';
import { FUEL_TYPES } from '../constants/enums.js';

const stockSnapshotSchema = new mongoose.Schema(
  {
    fuelType: {
      type: String,
      enum: Object.values(FUEL_TYPES),
      required: true,
      unique: true, // One snapshot per fuel type
    },
    stockOnHand: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    totalAdded: {
      type: Number,
      default: 0,
    },
    totalSold: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const StockSnapshot = mongoose.model('StockSnapshot', stockSnapshotSchema);
