import mongoose from 'mongoose';
import { EMPLOYEE_ROLES } from '../constants/enums.js';

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide employee name'],
      trim: true,
    },
    cnic: {
      type: String,
      required: [true, 'Please provide CNIC'],
      unique: true,
      match: [/^\d{5}-\d{7}-\d{1}$/, 'Please provide valid CNIC format (12345-1234567-1)'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(EMPLOYEE_ROLES),
      required: [true, 'Please specify employee role'],
    },
    salary: {
      type: Number,
      required: [true, 'Please provide monthly salary'],
      min: [0, 'Salary cannot be negative'],
    },
    joiningDate: {
      type: Date,
      required: [true, 'Please provide joining date'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for faster searches
employeeSchema.index({ cnic: 1 });
employeeSchema.index({ name: 1 });

export const Employee = mongoose.model('Employee', employeeSchema);
