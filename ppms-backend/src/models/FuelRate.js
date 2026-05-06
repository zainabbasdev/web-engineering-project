// models/FuelRate.js
import mongoose from 'mongoose';

const fuelRateSchema = new mongoose.Schema(
  {
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'CNG'],
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const FuelRate = mongoose.model('FuelRate', fuelRateSchema);