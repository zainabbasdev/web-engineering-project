// controllers/fuelRateController.js
import { FuelRate } from '../models/FuelRate.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getRates = async (req, res) => {
  const rates = await FuelRate.find();
  return sendSuccess(res, 'Rates fetched', rates);
};

export const setRate = async (req, res) => {
  const { fuelType, price } = req.body;

  if (!fuelType || !price) {
    return sendError(res, 'Missing fields', 400);
  }

  const rate = await FuelRate.findOneAndUpdate(
    { fuelType },
    { price },
    { upsert: true, new: true }
  );

  return sendSuccess(res, 'Rate updated', rate);
};