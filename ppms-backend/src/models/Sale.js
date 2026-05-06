import mongoose from 'mongoose';
import { FUEL_TYPES, SHIFTS } from '../constants/enums.js';

const saleSchema = new mongoose.Schema(
  {
    fuelType: {
      type: String,
      enum: Object.values(FUEL_TYPES),
      required: [true, 'Please specify fuel type'],
    },
    litersSold: {
      type: Number,
      required: [true, 'Please provide liters sold'],
      min: [0, 'Liters cannot be negative'],
    },
    pricePerLiter: {
      type: Number,
      required: [true, 'Please provide selling price per liter'],
      min: [0, 'Price cannot be negative'],
    },
    totalAmount: {
      type: Number,
      // Auto-calculated (revenue)
    },
    costPerLiter: {
      type: Number,
      min: [0, 'Cost cannot be negative'],
    },
    totalCost: {
      type: Number,
      // Auto-calculated
    },
    nozzleNumber: {
      type: String,
      trim: true,
    },
    shift: {
      type: String,
      enum: Object.values(SHIFTS),
      required: [true, 'Please specify shift'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide date'],
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Auto-calculate totalAmount and totalCost
saleSchema.pre('save', function (next) {
  if (this.isModified('litersSold') || this.isModified('pricePerLiter')) {
    this.totalAmount = this.litersSold * this.pricePerLiter;
  }
  if (this.isModified('litersSold') || this.isModified('costPerLiter')) {
    this.totalCost = this.litersSold * this.costPerLiter;
  }
  next();
});

// Index for faster queries
saleSchema.index({ fuelType: 1, shift: 1, date: 1 });

export const Sale = mongoose.model('Sale', saleSchema);
