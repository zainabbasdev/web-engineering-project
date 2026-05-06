import mongoose from 'mongoose';
import { FUEL_TYPES } from '../constants/enums.js';

const fuelTopupSchema = new mongoose.Schema(
  {
    fuelType: {
      type: String,
      enum: Object.values(FUEL_TYPES),
      required: [true, 'Please specify fuel type'],
    },
    litersAdded: {
      type: Number,
      required: [true, 'Please provide liters added'],
      min: [0, 'Liters cannot be negative'],
    },
    pricePerLiter: {
      type: Number,
      required: [true, 'Please provide price per liter'],
      min: [0, 'Price cannot be negative'],
    },
    totalCost: {
      type: Number,
      // Auto-calculated, not required from user
    },
    supplier: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Please provide date'],
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Auto-calculate totalCost
fuelTopupSchema.pre('save', function (next) {
  if (this.isModified('litersAdded') || this.isModified('pricePerLiter')) {
    this.totalCost = this.litersAdded * this.pricePerLiter;
  }
  next();
});

// Index for faster queries
fuelTopupSchema.index({ fuelType: 1, date: 1 });

export const FuelTopup = mongoose.model('FuelTopup', fuelTopupSchema);
